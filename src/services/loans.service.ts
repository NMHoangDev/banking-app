import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface Loan {
  loan_id: number;
  amount: number;
  interest_rate?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export function getLoans(): Promise<Loan[]> {
  return apiGet<Loan[]>("/loans");
}

export function getLoanById(id: number): Promise<Loan> {
  return apiGet<Loan>(`/loans/${id}`);
}

export function createLoan(data: Partial<Loan>): Promise<Loan> {
  return apiPost<Loan>("/loans", data);
}

export function updateLoan(id: number, data: Partial<Loan>): Promise<Loan> {
  return apiPut<Loan>(`/loans/${id}`, data);
}

export function deleteLoan(id: number): Promise<Loan> {
  return apiDelete<Loan>(`/loans/${id}`);
}
