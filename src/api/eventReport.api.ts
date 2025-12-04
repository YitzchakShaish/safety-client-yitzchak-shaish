import type { EventReport, EventReportWithId } from "../types";
import { getToken } from "../utils/storage";

const BASE_URL = "http://localhost:3000";
const token = getToken();

export async function createEventReport(data: EventReport) {
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
        const res = await fetch(`${BASE_URL}/event-report`, {
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

        return { status: res.status, message: result.message, success: true, user: result.user };

    } catch (error: any) {
        return { status: 0, message: error.message };
    }
}

export async function getAllEventReports({ page = 1, perPage = 10, q, dateFrom, dateTo }: {
    page?: number;
    perPage?: number;
    q?: string;
    dateFrom?: string | null;
    dateTo?: string | null;
}) {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (q) page = 1;
    query.set("page", String(page));
    query.set("perPage", String(perPage));

    if (dateFrom) query.set("dateFrom", dateFrom);
    if (dateTo) query.set("dateTo", dateTo);

    const res = await fetch(`${BASE_URL}/event-reports?${query}`, {

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

    return result;
}

export async function updateEventReport(data:EventReportWithId) {
    
    try {
        const res = await fetch(`${BASE_URL}/event-report`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
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
export async function deleteEventReport(id:string) {
    
    try {
        const res = await fetch(`${BASE_URL}/event-report/${id}`, {
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