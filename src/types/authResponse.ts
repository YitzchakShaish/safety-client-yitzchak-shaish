import type { SessionUser } from "./sessionUser";

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: SessionUser;
}