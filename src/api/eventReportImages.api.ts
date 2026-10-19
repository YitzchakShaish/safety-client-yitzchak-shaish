import { API_BASE_URL as BASE_URL } from "../config/env";
import { getToken } from "../utils/storage";

export async function uploadReportImages(reportId: string, images: File[]) {
    const token = getToken();
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
        const res = await fetch(`${BASE_URL}/reports/${reportId}/images`, {
            method: "POST",
            credentials: "include",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
        });

        let result: any = {};
        try {
            result = await res.json();
        } catch {
            result = { message: "" };
        }

        return {
            status: res.status,
            message: result.message || "",
            success: res.ok
        };

    } catch (error: any) {
        return { status: 0, message: error.message || "Unknown error", success: false };
    }
}

