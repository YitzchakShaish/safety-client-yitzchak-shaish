import { API_BASE_URL as BASE_URL } from "../config/env";

export interface AddressSuggestion {
    displayName: string;
    latitude: number;
    longitude: number;
}

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
    try {
        const res = await fetch(`${BASE_URL}/geo/search?q=${encodeURIComponent(query)}`);
        const result = await res.json();
        return result?.data ?? [];
    } catch {
        return [];
    }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<AddressSuggestion | null> {
    try {
        const query = new URLSearchParams({ lat: String(latitude), lon: String(longitude) });
        const res = await fetch(`${BASE_URL}/geo/reverse?${query}`);
        if (!res.ok) return null;
        const result = await res.json();
        return result?.data ?? null;
    } catch {
        return null;
    }
}
