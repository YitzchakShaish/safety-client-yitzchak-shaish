import { getToken, removeToken, removeUser } from "../utils/storage";

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    else headers.delete("Authorization");

    const response = await fetch(url, { ...options, credentials: "include", headers });
    // A response from an older session must not sign out a newly logged-in user.
    if (response.status === 401 && getToken() === token) {
        removeToken();
        removeUser();
        window.dispatchEvent(new Event("session-expired"));
    }
    return response;
}
