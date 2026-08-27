import { createContext, useState, type ReactNode } from "react";
import { getUser, removeToken, removeUser, setUser } from "../utils/storage";

interface UserContextType {
    user: any;
    updateUser: (newUser: any) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState(getUser());


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


