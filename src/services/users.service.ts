import { apiGet } from "./api";

export interface ApiUserRow {
  user_id: number;
  username: string;
  status: string;
  customer_id: number | null;
  role_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  customer_created_at: string | null;
}

export function getUsers(): Promise<ApiUserRow[]> {
  return apiGet<ApiUserRow[]>("/users");
}

