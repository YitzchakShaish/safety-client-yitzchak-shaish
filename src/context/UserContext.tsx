import { getCurrentUser } from "../api/users.api";
import { getToken } from "../utils/storage";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { getUser, removeToken, removeUser, setUser } from "../utils/storage";

interface UserContextType {
    user: any;
    updateUser: (newUser: any) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState(getUser());

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


    const updateUser = (newUser: any) => {
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


