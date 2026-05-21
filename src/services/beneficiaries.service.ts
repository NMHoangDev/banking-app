import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface Beneficiary {
  beneficiary_id?: number;
  name: string;
  account_number: string;
  bank_name?: string;
  created_at?: string;
}

export function getBeneficiaries(): Promise<Beneficiary[]> {
  return apiGet<Beneficiary[]>("/beneficiaries");
}

export function getBeneficiaryById(id: number): Promise<Beneficiary> {
  return apiGet<Beneficiary>(`/beneficiaries/${id}`);
}

export function createBeneficiary(
  data: Partial<Beneficiary>,
): Promise<Beneficiary> {
  return apiPost<Beneficiary>("/beneficiaries", data);
}

export function updateBeneficiary(
  id: number,
  data: Partial<Beneficiary>,
): Promise<Beneficiary> {
  return apiPut<Beneficiary>(`/beneficiaries/${id}`, data);
}

export function deleteBeneficiary(id: number): Promise<Beneficiary> {
  return apiDelete<Beneficiary>(`/beneficiaries/${id}`);
}
