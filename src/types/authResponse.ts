export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    fullName: string;
    email: string;
  };
}