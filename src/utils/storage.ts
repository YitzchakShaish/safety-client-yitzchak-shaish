import type { SessionUser } from "../types/sessionUser";

export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token: string) {
    removeToken()
    localStorage.setItem("token", token);
}


export function removeToken() {
    localStorage.removeItem("token");
}


export function setUser(user: SessionUser) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): SessionUser | null {
    const str = localStorage.getItem("user");
    if (!str) return null;

    try {
        return JSON.parse(str) as SessionUser;
    } catch {
        return null;
    }
}

export function removeUser() {
    localStorage.removeItem("user");
}
