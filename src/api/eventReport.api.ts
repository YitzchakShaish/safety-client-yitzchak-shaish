import { authenticatedFetch } from "./authenticatedFetch";
import type { EventReport, EventReportWithId } from "../types";
import { getToken } from "../utils/storage";
import { API_BASE_URL as BASE_URL } from "../config/env";

export async function createEventReport(data: EventReport) {
    const token = getToken();
    const payload = {
        ...data,
        summaryInfo: {
            ...data.summaryInfo,
            injuryLevel: data.summaryInfo.injuryLevel === "בחר/י"
                ? undefined
                : data.summaryInfo.injuryLevel
        }
    };

    try {
        const res = await authenticatedFetch(`${BASE_URL}/event-report`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        let result: any = {};
        try {
            result = await res.json();

        } catch { }

        if (!res.ok || typeof result.data?.id !== "string") {
            return { status: res.status, message: result.message || "אירעה שגיאה ביצירת הדוח", success: false };
        }
        return { status: res.status, message: result.message, success: true, user: result.user, id: result.data.id as string };

    } catch (error: any) {
        return { status: 0, message: error.message };
    }
}

export async function getEventReport(id: string): Promise<EventReportWithId> {
    const res = await authenticatedFetch(`${BASE_URL}/event-report/${encodeURIComponent(id)}`, {
        credentials: "include",
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const result = await res.json();
    if (!res.ok || !result.data) {
        throw new Error(result.message || "שגיאה בטעינת האירוע");
    }
    return result.data;
}

export async function getAllEventReports({ page = 1, perPage = 10, q, dateFrom, dateTo }: {
    page?: number;
    perPage?: number;
    q?: string;
    dateFrom?: string | null;
    dateTo?: string | null;
}) {
    const token = getToken();
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (q) page = 1;
    query.set("page", String(page));
    query.set("perPage", String(perPage));

    if (dateFrom) query.set("dateFrom", dateFrom);
    if (dateTo) query.set("dateTo", dateTo);

    const res = await authenticatedFetch(`${BASE_URL}/event-reports?${query}`, {

        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    let result: any = {};
    try {
        result = await res.json();

    } catch { }
    if (res.status === 403)
        return { status: 403, result: null };

    return { result, status: res.status };
}

/** Every report in the date range. Free-text matching is done on the client. */
export async function getEveryEventReport({ dateFrom, dateTo }: {
    dateFrom?: string | null;
    dateTo?: string | null;
}): Promise<{ status: number; data: EventReportWithId[] }> {
    const perPage = 100;
    const data: EventReportWithId[] = [];
    let page = 1;

    for (;;) {
        const { result, status } = await getAllEventReports({ page, perPage, dateFrom, dateTo });
        if (status !== 200 || !result) return { status, data: [] };

        const batch: EventReportWithId[] = Array.isArray(result.data) ? result.data : [];
        data.push(...batch);

        const total = Number(result.pagination?.total ?? data.length);
        if (batch.length === 0 || data.length >= total || page >= 200) {
            return { status: 200, data };
        }
        page += 1;
    }
}

export async function updateEventReport(data: EventReportWithId) {
    const token = getToken();
    const payload = {
        id: data.id,
        eventInfo: { ...data.eventInfo },
        reporterInfo: { ...data.reporterInfo },
        summaryInfo: { ...data.summaryInfo },
    }


    try {
        const res = await authenticatedFetch(`${BASE_URL}/event-report`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        let result: any = {};
        try {
            result = await res.json();

        } catch { }

        return { status: res.status, message: result.message, success: true, user: result.user };

    } catch (error: any) {
        return { status: 0, message: error.message };
    }
}
export async function deleteEventReport(id: string) {
    const token = getToken();
    try {
        const res = await authenticatedFetch(`${BASE_URL}/event-report/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        let result: any = {};
        try {
            result = await res.json();
        } catch { }

        return { status: res.status, message: result.message, user: result.user };

    } catch (error: any) {
        return { status: 0, message: error.message };
    }
}
