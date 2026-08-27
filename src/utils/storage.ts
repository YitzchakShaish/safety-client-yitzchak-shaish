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


export function setUser(user: object) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
    const str = localStorage.getItem("user");
    if (!str) return null;

    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}

export function removeUser() {
    localStorage.removeItem("user");
}
