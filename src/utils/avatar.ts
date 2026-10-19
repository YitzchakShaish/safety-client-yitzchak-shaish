export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export const AVATAR_TYPE_MESSAGE = "ניתן להעלות קובצי תמונה בלבד (JPG, PNG, WEBP או GIF)";
export const AVATAR_SIZE_MESSAGE = "גודל התמונה חורג מהמותר (עד 5MB)";
export const AVATAR_REQUIRED_MESSAGE = "יש לבחור תמונת פרופיל";
export const AVATAR_INVALID_MESSAGE = "הקובץ אינו תמונה תקינה";

const ALLOWED_EXTENSIONS: Record<string, readonly string[]> = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
};

export type AvatarFile = {
    name: string;
    type: string;
    size: number;
};

export function validateAvatarFile(file: AvatarFile | null | undefined): string | null {
    if (!file) return AVATAR_REQUIRED_MESSAGE;

    const mime = (file.type || "").split(";")[0].trim().toLowerCase();
    const dot = file.name.lastIndexOf(".");
    const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
    const allowed = ALLOWED_EXTENSIONS[mime];
    if (!allowed || !allowed.includes(extension)) return AVATAR_TYPE_MESSAGE;
    if (file.size <= 0) return AVATAR_INVALID_MESSAGE;
    if (file.size > AVATAR_MAX_BYTES) return AVATAR_SIZE_MESSAGE;
    return null;
}

export function resolveAvatarUrl(avatarUrl: string | null | undefined, baseUrl: string): string | undefined {
    if (!avatarUrl) return undefined;
    if (/^(https?:|blob:|data:)/i.test(avatarUrl)) return avatarUrl;
    const base = baseUrl.replace(/\/+$/, "");
    const path = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
    return `${base}${path}`;
}

export function userInitials(fullName: string | null | undefined): string {
    const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 1);
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`;
}

/**
 * Upload returns the full user. Delete returns `{ avatarUrl: null }`
 * (or a full user whose avatar was cleared). Keep the signed-in profile either way.
 */
export function mergeUserAvatar<T extends { avatarUrl?: string | null }>(current: T, data: unknown): T {
    if (!data || typeof data !== "object") {
        return { ...current, avatarUrl: null };
    }

    const record = data as T & { avatarUrl?: string | null; id?: unknown; fullName?: unknown };
    const avatarUrl = Object.prototype.hasOwnProperty.call(record, "avatarUrl")
        ? record.avatarUrl ?? null
        : current.avatarUrl ?? null;

    if (typeof record.id === "string" && typeof record.fullName === "string") {
        return { ...current, ...record, avatarUrl };
    }

    return { ...current, avatarUrl };
}
