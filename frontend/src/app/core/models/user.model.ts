export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  status?: number;
  message?: string;
  timestamp?: string;
}
