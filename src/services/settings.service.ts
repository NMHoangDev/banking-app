import { apiGet, apiPut } from "./api";

export interface Settings {
  key: string;
  value: string;
}

export function getSettings(): Promise<Record<string, string>> {
  return apiGet<Record<string, string>>("/settings");
}

export function updateSettings(
  data: Record<string, string>,
): Promise<Record<string, string>> {
  return apiPut<Record<string, string>>("/settings", data);
}
