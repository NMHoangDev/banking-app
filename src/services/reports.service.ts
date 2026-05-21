import { apiGet } from "./api";

export type ReportType = "Financial" | "Revenue" | "Risk" | "Audit";

export type ReportStatus = "Completed" | "Pending";

export interface ReportItem {
  id: string;
  name: string;
  type: ReportType;
  date: string; // ISO string
  size_mb: number;
  creator: string;
  status: ReportStatus;
}

export interface ReportsBar {
  month: string; // YYYY-MM
  capital: number;
  spending: number;
}

export interface ReportsPortfolioItem {
  name: string;
  percent: number;
  value: number;
}

export interface ReportsOverview {
  total_assets: number;
  total_assets_active: number;
  customer_count: number;
  account_count: number;
  active_account_count: number;
  transaction_volume: number;
  transaction_count: number;
}

export interface ReportsSummaryResponse {
  months: number;
  overview: ReportsOverview;
  bars: ReportsBar[];
  portfolio: ReportsPortfolioItem[];
  reports: ReportItem[];
}

export function getReportsSummary(months = 6) {
  return apiGet<ReportsSummaryResponse>(`/reports/summary?months=${encodeURIComponent(months)}`);
}

