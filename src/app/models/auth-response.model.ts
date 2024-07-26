export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string | null;
  status: number;
  token: string;
  user: User;
  role: string;
}
