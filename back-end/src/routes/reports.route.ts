import { Router, Request, Response } from "express";
import { pool } from "../db";

const reportsRoute = Router();

// GET /api/reports - return list of generated reports
reportsRoute.get("/", async (req: Request, res: Response) => {
  try {
    // In a real app, this would query a reports table. We'll return mock reports for now
    // since the prompt mainly asked for /api/reports/summary to use analytics_schema.
    const mockReports = [
      { report_id: "2023-001", name: "Báo cáo Tài chính Q3/2023", type: "Financial", created_at: new Date().toISOString(), size: "2.4 MB", creator: "Nguyễn Văn Thành", status: "COMPLETED", url: "/mock-url-1" },
      { report_id: "2023-002", name: "Báo cáo Doanh thu", type: "Revenue", created_at: new Date().toISOString(), size: "1.8 MB", creator: "Lê Minh Hoàng", status: "COMPLETED", url: "/mock-url-2" }
    ];
    return res.status(200).json(mockReports);
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// GET /api/reports/summary - use real KPI view
reportsRoute.get("/summary", async (req: Request, res: Response) => {
  try {
    // Queries from analytics_schema views as requested
    const kpiResult = await pool.query(`SELECT * FROM analytics_schema.kpi_summary LIMIT 1`);
    return res.status(200).json(kpiResult.rows[0] || { message: "No KPI data" });
  } catch (error) {
    console.error("GET /api/reports/summary error:", error);
    // fallback if view doesn't exist
    return res.status(500).json({ message: "Failed to generate report summary" });
  }
});

reportsRoute.post("/generate", async (req: Request, res: Response) => {
  try {
    const reportUrl = "/reports/generated/report-" + Date.now() + ".pdf";
    return res.status(201).json({ url: reportUrl });
  } catch (error) {
    console.error("POST /api/reports/generate error:", error);
    return res.status(500).json({ message: "Failed to generate report" });
  }
});

export default reportsRoute;
