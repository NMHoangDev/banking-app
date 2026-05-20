import { apiPost } from "./api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface AuthUser {
  user_id: number;
  username: string;
  role_id?: number;
  role_name?: string;
  status: string;
  customer_id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export function login(data: LoginPayload) {
  return apiPost<AuthResponse>("/auth/login", data);
}

export function register(data: RegisterPayload) {
  return apiPost<AuthResponse>("/auth/register", data);
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch("http://localhost:8000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Cannot get current user");
  }

  return response.json() as Promise<AuthUser>;
}

export function saveAuth(data: AuthResponse) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getSavedUser(): AuthUser | null {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user) as AuthUser;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

