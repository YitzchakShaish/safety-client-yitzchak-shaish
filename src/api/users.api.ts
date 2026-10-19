import { authenticatedFetch } from "./authenticatedFetch";
import { API_BASE_URL } from "../config/env";
import { validateAvatarFile } from "../utils/avatar";

export type UserRole = "user" | "safety_officer" | "admin";
export interface ManagedUser {
    id: string;
    fullName: string;
    email: string;
    rank: string;
    role: UserRole;
    unit: string;
    position: string;
    avatarUrl?: string | null;
}
export const roleLabels: Record<UserRole, string> = {
    user: "משתמש", safety_officer: "קצין בטיחות", admin: "מנהל מערכת"
};

export function roleLabel(role: string | null | undefined): string {
    if (role === "user" || role === "safety_officer" || role === "admin") return roleLabels[role];
    return role?.trim() || "—";
}

async function readBody(response: Response): Promise<{ message?: unknown; data?: unknown }> {
    try {
        return await response.json();
    } catch {
        return {};
    }
}

function serverMessage(body: { message?: unknown }, fallback: string): string {
    return typeof body.message === "string" && body.message.trim() ? body.message : fallback;
}
export async function getUsers(): Promise<ManagedUser[]> {
    const response = await authenticatedFetch(`${API_BASE_URL}/users/get-all`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "לא ניתן לטעון משתמשים");
    return result.data;
}
export async function saveUser(user: ManagedUser): Promise<ManagedUser> {
    const { rank, role, unit, position } = user;
    const response = await authenticatedFetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rank, role, unit, position })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "לא ניתן לשמור משתמש");
    return result.data;
}
export async function getCurrentUser(): Promise<ManagedUser> {
    const response = await authenticatedFetch(`${API_BASE_URL}/users/me`);
    const result = await response.json();
    if (!response.ok) throw new Error("לא ניתן לטעון את המשתמש");
    return result.data;
}

export async function uploadMyAvatar(file: File): Promise<{ message: string; data: unknown }> {
    const validationError = validateAvatarFile(file);
    if (validationError) throw new Error(validationError);

    const body = new FormData();
    body.append("avatar", file);

    let response: Response;
    try {
        response = await authenticatedFetch(`${API_BASE_URL}/users/me/avatar`, {
            method: "POST",
            body,
        });
    } catch {
        throw new Error("לא ניתן להתחבר לשרת");
    }

    const result = await readBody(response);
    if (!response.ok) throw new Error(serverMessage(result, "לא ניתן להעלות את הקובץ"));
    return {
        message: serverMessage(result, "תמונת הפרופיל עודכנה בהצלחה"),
        data: result.data,
    };
}

export async function removeMyAvatar(): Promise<{ message: string; data: unknown }> {
    let response: Response;
    try {
        response = await authenticatedFetch(`${API_BASE_URL}/users/me/avatar`, { method: "DELETE" });
    } catch {
        throw new Error("לא ניתן להתחבר לשרת");
    }

    const result = await readBody(response);
    if (!response.ok) throw new Error(serverMessage(result, "לא ניתן להסיר את תמונת הפרופיל"));
    return {
        message: serverMessage(result, "תמונת הפרופיל הוסרה"),
        data: result.data ?? { avatarUrl: null },
    };
}
