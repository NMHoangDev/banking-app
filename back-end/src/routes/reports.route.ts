import { Router, Request, Response } from "express";
import { pool } from "../db";

const reportsRoute = Router();

reportsRoute.get("/", async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };

    const params: any[] = [];
    let where = "";
    if (from) {
      params.push(from);
      where += ` AND t.created_at >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      where += ` AND t.created_at <= $${params.length}`;
    }

    const q = `SELECT COUNT(*)::int as total_transactions, COALESCE(SUM(t.amount),0)::numeric as total_amount FROM core_schema.transactions t WHERE 1=1 ${where}`;
    const result = await pool.query(q, params);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return res.status(500).json({ message: "Failed to generate report" });
  }
});

reportsRoute.post("/generate", async (req: Request, res: Response) => {
  // For simplicity return a generated URL placeholder
  try {
    const reportUrl = "/reports/generated/report-" + Date.now() + ".pdf";
    return res.status(201).json({ url: reportUrl });
  } catch (error) {
    console.error("POST /api/reports/generate error:", error);
    return res.status(500).json({ message: "Failed to generate report" });
  }
});

export default reportsRoute;
