import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface Bill {
  bill_id: number;
  bill_type: string;
  amount: number;
  due_date?: string;
  status?: string;
}

export function getBills(): Promise<Bill[]> {
  return apiGet<Bill[]>("/bills");
}

export function getBillById(id: number): Promise<Bill> {
  return apiGet<Bill>(`/bills/${id}`);
}

export function createBill(data: Partial<Bill>): Promise<Bill> {
  return apiPost<Bill>("/bills", data);
}

export function updateBill(id: number, data: Partial<Bill>): Promise<Bill> {
  return apiPut<Bill>(`/bills/${id}`, data);
}

export function deleteBill(id: number): Promise<Bill> {
  return apiDelete<Bill>(`/bills/${id}`);
}
