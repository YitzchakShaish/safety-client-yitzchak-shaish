import { authenticatedFetch } from "./authenticatedFetch";
import { API_BASE_URL } from "../config/env";

export interface SafetyOverview {
    from: string; to: string; unit: string; units: string[];
    total: number; severe: number; open: number; treated: number;
    categories: { label: string; value: number }[];
    weeks: { date: string; total: number; severe: number }[];
    events: { id: string; date: string; unit: string; category: string; severity: string; status: string; description: string }[];
}
export async function getSafetyOverview(from: string, to: string, unit: string): Promise<SafetyOverview> {
    const response = await authenticatedFetch(`${API_BASE_URL}/safety-overview?${new URLSearchParams({ from, to, unit })}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "לא ניתן לטעון סקירת בטיחות");
    return result.data;
}
