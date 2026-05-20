import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface Branch {
  branch_id: number;
  name: string;
  address?: string;
  phone?: string;
}

export function getBranches(): Promise<Branch[]> {
  return apiGet<Branch[]>("/branches");
}

export function getBranchById(id: number): Promise<Branch> {
  return apiGet<Branch>(`/branches/${id}`);
}

export function createBranch(data: Partial<Branch>): Promise<Branch> {
  return apiPost<Branch>("/branches", data);
}

export function updateBranch(
  id: number,
  data: Partial<Branch>,
): Promise<Branch> {
  return apiPut<Branch>(`/branches/${id}`, data);
}

export function deleteBranch(id: number): Promise<Branch> {
  return apiDelete<Branch>(`/branches/${id}`);
}
