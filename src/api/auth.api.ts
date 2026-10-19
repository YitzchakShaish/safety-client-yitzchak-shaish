import type { AuthResponse } from "../types/authResponse";
import type { SessionUser } from "../types/sessionUser";
import { setToken, setUser } from "../utils/storage";
import { API_BASE_URL } from "../config/env";


const BASE_URL = `${API_BASE_URL}/auth`;

interface AuthPayload {
  message?: string;
  user?: SessionUser;
  token?: string;
}

const authFailure = (message = "שגיאה בשרת"): AuthResponse => ({ success: false, message });

export const signup = async (fullName: string, email: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });
    const data = (await res.json()) as AuthPayload;
    return { success: res.ok, message: data.message ?? "", user: data.user };
  } catch {
    return authFailure();
  }
};

export const login = async (fullName: string, email: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });

    const data = (await res.json()) as AuthPayload;
    // console.log(data)
    if (data?.token) {
      setToken(data.token);
    }
     if (data?.user) {
      console.log(data.user)
      setUser(data.user);
    }
    return { success: res.ok, message: data.message ?? "", user: data.user };
  } catch {
    return authFailure();
  }
};
