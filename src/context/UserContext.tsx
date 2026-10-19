import { useEffect, useState, type ReactNode } from "react";
import { getCurrentUser } from "../api/users.api";
import type { SessionUser } from "../types/sessionUser";
import { getToken, getUser, removeToken, removeUser, setUser } from "../utils/storage";
import { UserContext } from "./userContextBase";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<SessionUser | null>(getUser());

    useEffect(() => {
        const onSessionExpired = () => setUserState(null);
        const refreshUser = () => {
            const token = getToken();
            if (!token) return;
            getCurrentUser().then(current => {
                if (getToken() !== token) return;
                setUser(current);
                setUserState(current);
            }).catch(() => { /* Session expiry is handled by authenticatedFetch. */ });
        };
        refreshUser();
        window.addEventListener("focus", refreshUser);
        window.addEventListener("session-expired", onSessionExpired);
        return () => {
            window.removeEventListener("session-expired", onSessionExpired);
            window.removeEventListener("focus", refreshUser);
        };
    }, []);


    const updateUser = (newUser: SessionUser) => {
        setUser(newUser);
        setUserState(newUser);
    };
    const logout = ( ) => {
        removeUser();
        removeToken();
        setUserState(null);
    }


    return (
        <UserContext.Provider value={{ user, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
