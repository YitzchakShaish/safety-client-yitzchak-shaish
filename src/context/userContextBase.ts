import { createContext } from "react";
import type { SessionUser } from "../types/sessionUser";

export interface UserContextType {
  user: SessionUser | null;
  updateUser: (newUser: SessionUser) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
