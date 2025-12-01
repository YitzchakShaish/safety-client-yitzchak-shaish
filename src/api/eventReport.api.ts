import type { EventReportWithId } from "../types";

export async function createEventReport(data: EventReportWithId) {
    const res = await fetch("/event-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    
    return res;
}
