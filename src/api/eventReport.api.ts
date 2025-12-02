import type { EventReport } from "../types";
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
                "Authorization": `Bearer ${token || ""}`
            },
            body: JSON.stringify(payload)
        });

        let result: any = {};
        try {
            result = await res.json(); 
        } catch {}

        return { status: res.status, message: result.message, success: true };

    } catch (error: any) {
        return { status: 0, message: [error.message] };
    }
}
