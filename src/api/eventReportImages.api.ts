import { authenticatedFetch } from "./authenticatedFetch";
import { API_BASE_URL as BASE_URL } from "../config/env";
import { getToken } from "../utils/storage";
import { errorMessage, readJson } from "./readJson";

interface ImageUploadResponse {
    message?: string;
}

export async function uploadReportImages(reportId: string, images: File[]) {
    const token = getToken();
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
        const res = await authenticatedFetch(`${BASE_URL}/reports/${reportId}/images`, {
            method: "POST",
            credentials: "include",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
        });

        const result = await readJson<ImageUploadResponse>(res, { message: "" });

        return {
            status: res.status,
            message: result.message || "",
            success: res.ok
        };

    } catch (error: unknown) {
        return { status: 0, message: errorMessage(error) || "Unknown error", success: false };
    }
}
