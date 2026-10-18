import { authenticatedFetch } from "./authenticatedFetch";
import { API_BASE_URL } from "../config/env";

export type UserRole = "user" | "safety_officer" | "admin";
export interface ManagedUser {
    id: string;
    fullName: string;
    email: string;
    rank: string;
    role: UserRole;
    unit: string;
    position: string;
}
export const roleLabels: Record<UserRole, string> = {
    user: "משתמש", safety_officer: "קצין בטיחות", admin: "מנהל מערכת"
};
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
