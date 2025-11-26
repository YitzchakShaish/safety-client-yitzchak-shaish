import type { AuthResponse } from "../types/authResponse";


const BASE_URL = "http://localhost:3000/auth"; 

export const signup = async (fullName: string, email: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });

    const data = await res.json();
    return { success: res.ok, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: "שגיאה בשרת" };
  }
};

export const login = async (fullName: string, email: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });

    const data = await res.json();
    return { success: res.ok, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: "שגיאה בשרת" };
  }
};
