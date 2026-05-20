import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export interface Customer {
  customer_id: number;
  full_name: string;
  date_of_birth: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
}

export interface CustomerPayload {
  full_name: string;
  date_of_birth: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export function getCustomers(): Promise<Customer[]> {
  return apiGet<Customer[]>("/customers");
}

export function getCustomerById(id: number): Promise<Customer> {
  return apiGet<Customer>(`/customers/${id}`);
}

export function createCustomer(data: CustomerPayload): Promise<Customer> {
  return apiPost<Customer>("/customers", data);
}

export function updateCustomer(id: number, data: CustomerPayload): Promise<Customer> {
  return apiPut<Customer>(`/customers/${id}`, data);
}

export function deleteCustomer(id: number): Promise<Customer> {
  return apiDelete<Customer>(`/customers/${id}`);
}
