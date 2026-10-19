import { authenticatedFetch } from "./authenticatedFetch";
import { getToken } from "../utils/storage";
import { API_BASE_URL as BASE_URL } from "../config/env";
import { errorMessage, readJson } from "./readJson";

export interface OverviewStats {
    totalEvents: number;
    completedToday: number;
    openEvents: number;
    highPriorityEvents: number;
}

interface OverviewResponse {
    message?: string;
    data?: OverviewStats | null;
}

export async function getOverviewStats() {
    const token = getToken();

    try {
        const res = await authenticatedFetch(`${BASE_URL}/overview`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
                "Content-Type": "application/json"
            },
        });

        const result = await readJson<OverviewResponse | null>(res, null);
        console.log(result);
        return {
            status: res.status,
            message: result?.message || "",
            success: res.ok,
            // Accessing data on a null body still throws, matching the previous catch path.
            data: (result as OverviewResponse).data,
        };

    } catch (error: unknown) {
        return { status: 0, message: errorMessage(error), success: false, data: null };
    }
}
