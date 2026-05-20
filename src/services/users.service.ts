import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface User {
  user_id: number;
  username: string;
  role_id?: number;
  status?: string;
  customer_id?: number | null;
}

export function getUsers(): Promise<User[]> {
  return apiGet<User[]>("/users");
}

export function getUserById(id: number): Promise<User> {
  return apiGet<User>(`/users/${id}`);
}

export function createUser(data: Partial<User>): Promise<User> {
  return apiPost<User>("/users", data);
}

export function updateUser(id: number, data: Partial<User>): Promise<User> {
  return apiPut<User>(`/users/${id}`, data);
}

export function deleteUser(id: number): Promise<User> {
  return apiDelete<User>(`/users/${id}`);
}
