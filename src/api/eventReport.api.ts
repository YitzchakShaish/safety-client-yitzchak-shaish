import { authenticatedFetch } from "./authenticatedFetch";
import type { EventReport, EventReportWithId } from "../types";
import type { SessionUser } from "../types/sessionUser";
import { getToken } from "../utils/storage";
import { API_BASE_URL as BASE_URL } from "../config/env";
import { errorMessage, readJson } from "./readJson";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Extend a calendar day so a `<= dateTo` comparison keeps that entire day. */
export function inclusiveDateTo(dateTo: string): string {
    if (DATE_ONLY.test(dateTo)) return `${dateTo} 23:59:59.999`;
    return dateTo;
}

function asBoolean(value: unknown): boolean {
    return value === true || value === "true";
}

export type ApiMessage = string | string[];

interface EventMutationResponse {
    message?: ApiMessage;
    user?: SessionUser;
    data?: { id?: unknown };
}

export interface EventReportPage {
    data?: EventReportWithId[];
    pagination?: {
        total?: number;
        page?: number;
    };
    message?: ApiMessage;
}

export interface CreateEventReportResult {
    status: number;
    message?: ApiMessage;
    success?: boolean;
    user?: SessionUser;
    id?: string;
}

export interface MutateEventReportResult {
    status: number;
    message?: ApiMessage;
    success?: boolean;
    user?: SessionUser;
}

export async function createEventReport(data: EventReport): Promise<CreateEventReportResult> {
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

        const result = await readJson<EventMutationResponse>(res, {});
        const id = result.data && typeof result.data.id === "string" ? result.data.id : undefined;

        if (!res.ok || !id) {
            return { status: res.status, message: result.message || "אירעה שגיאה ביצירת הדוח", success: false };
        }
        return { status: res.status, message: result.message, success: true, user: result.user, id };

    } catch (error: unknown) {
        return { status: 0, message: errorMessage(error) };
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
}): Promise<{ status: number; result: EventReportPage | null }> {
    const token = getToken();
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (q) page = 1;
    query.set("page", String(page));
    query.set("perPage", String(perPage));

    if (dateFrom) query.set("dateFrom", dateFrom);
    // A date-only upper bound is midnight, which drops every later event that day.
    if (dateTo) query.set("dateTo", inclusiveDateTo(dateTo));

    const res = await authenticatedFetch(`${BASE_URL}/event-reports?${query}`, {

        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    const result = await readJson<EventReportPage>(res, {});
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

export async function updateEventReport(data: EventReportWithId): Promise<MutateEventReportResult> {
    const token = getToken();
    const payload = {
        id: data.id,
        eventInfo: { ...data.eventInfo },
        reporterInfo: { ...data.reporterInfo },
        summaryInfo: {
            ...data.summaryInfo,
            approval: asBoolean(data.summaryInfo.approval),
        },
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

        const result = await readJson<EventMutationResponse>(res, {});

        return { status: res.status, message: result.message, success: true, user: result.user };

    } catch (error: unknown) {
        return { status: 0, message: errorMessage(error) };
    }
}
export async function deleteEventReport(id: string): Promise<MutateEventReportResult> {
    const token = getToken();
    try {
        const res = await authenticatedFetch(`${BASE_URL}/event-report/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const result = await readJson<EventMutationResponse>(res, {});

        return { status: res.status, message: result.message, user: result.user };

    } catch (error: unknown) {
        return { status: 0, message: errorMessage(error) };
    }
}
