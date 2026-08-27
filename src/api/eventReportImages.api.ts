const BASE_URL = "http://localhost:3000";
export async function uploadReportImages(reportId: string, images: File[]) {
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
        const res = await fetch(`${BASE_URL}/reports/${reportId}/images`, {
            method: "POST",
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

