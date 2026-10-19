export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id?: string;
    fullName: string;
    email: string;
    rank?: string;
    role?: string;
    unit?: string;
    position?: string;
    avatarUrl?: string | null;
  };
}