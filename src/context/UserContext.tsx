import { createContext, useState, type ReactNode } from "react";
import { getUser, setUser } from "../utils/storage";

interface UserContextType {
    user: any;
    updateUser: (newUser: any) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState(getUser());


    const updateUser = (newUser: any) => {
        setUser(newUser);
        setUserState(newUser);
    };


    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};


