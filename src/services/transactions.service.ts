import { apiGet, apiPost } from "./api";

export interface Transaction {
  transaction_id: number;
  from_account_id: number;
  from_account_number?: string;
  to_account_id: number;
  to_account_number?: string;
  amount: string;
  transaction_type: string;
  status: string;
  created_at: string;
}

export interface TransferPayload {
  from_account_id: number;
  to_account_id: number;
  amount: number;
}

export function getTransactions(): Promise<Transaction[]> {
  return apiGet<Transaction[]>("/transactions");
}

export function transferMoney(data: TransferPayload): Promise<{ message: string; transaction: Transaction }> {
  return apiPost<{ message: string; transaction: Transaction }>("/transactions/transfer", data);
}
