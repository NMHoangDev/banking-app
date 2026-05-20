import { apiGet } from "./api";

export interface AuditLog {
  id: number;
  action: string;
  performed_by?: string;
  created_at?: string;
  details?: any;
}

export function getAuditLogs(): Promise<AuditLog[]> {
  return apiGet<AuditLog[]>("/audit-logs");
}
