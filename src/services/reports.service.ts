import { apiGet, apiPost } from "./api";

export interface ReportParams {
  from?: string;
  to?: string;
  type?: string;
}

export function getReports(params?: ReportParams): Promise<any[]> {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null) as any,
      ).toString()
    : "";
  return apiGet<any[]>(`/reports${qs}`);
}

export function generateReport(
  params?: ReportParams,
): Promise<{ url: string }> {
  return apiPost<{ url: string }>("/reports/generate", params ?? {});
}
