const BASE_URL = "http://localhost:3000";

export interface WeatherResult {
    condition: string;
    temperatureC: number | null;
}

export async function getWeather(latitude: number, longitude: number, date: string, time: string): Promise<WeatherResult | null> {
    try {
        const query = new URLSearchParams({ lat: String(latitude), lon: String(longitude), date, time });
        const res = await fetch(`${BASE_URL}/weather?${query}`);
        if (!res.ok) return null;
        const result = await res.json();
        return result?.data ?? null;
    } catch {
        return null;
    }
}
