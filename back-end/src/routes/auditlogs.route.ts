import { Router, Request, Response } from "express";
import { pool } from "../db";

const auditLogsRoute = Router();

auditLogsRoute.get("/", async (req: Request, res: Response) => {
  try {
    const { limit = "100" } = req.query as { limit?: string };
    const n = Math.max(1, Math.min(1000, Number(limit || 100)));
    const result = await pool.query(
      `SELECT id, action, performed_by, created_at, details FROM core_schema.audit_logs ORDER BY created_at DESC LIMIT $1`,
      [n],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/audit-logs error:", error);
    return res.status(500).json({ message: "Failed to fetch audit logs" });
  }
});

export default auditLogsRoute;
