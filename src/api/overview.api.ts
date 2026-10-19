import { getToken } from "../utils/storage";
import { API_BASE_URL as BASE_URL } from "../config/env";

export async function getOverviewStats() {
    const token = getToken();

    try {
        const res = await fetch(`${BASE_URL}/overview`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
                "Content-Type": "application/json"
            },
        });

        let result: any = null;
        try {
            result = await res.json();
        } catch {
            result = null;
        }
        console.log(result);
        return {
            status: res.status,
            message: result?.message || "",
            success: res.ok,
            data: result.data
        };

    } catch (error: any) {
        return { status: 0, message: error.message, success: false, data: null };
    }
}
