import { apiGet, apiPost } from "./api";

export interface Account {
  account_id: number;
  customer_id: number;
  full_name: string;
  type_name: string;
  account_number: string;
  balance: string;
  status: string;
  created_at: string;
}

export interface AccountPayload {
  customer_id: number;
  type_id: number;
  account_number: string;
  balance: number;
  status?: string;
}

export function getAccounts(): Promise<Account[]> {
  return apiGet<Account[]>("/accounts");
}

export function getAccountById(id: number): Promise<Account> {
  return apiGet<Account>(`/accounts/${id}`);
}

export function createAccount(data: AccountPayload): Promise<Account> {
  return apiPost<Account>("/accounts", data);
}
