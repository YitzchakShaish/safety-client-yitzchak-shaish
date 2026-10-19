export type PermissionLevel = "basic" | "advanced" | "admin";

export function getPermissionLevel(role?: string): PermissionLevel {
    if (role === "admin") return "admin";
    if (role === "safety_officer") return "advanced";
    return "basic";
}
