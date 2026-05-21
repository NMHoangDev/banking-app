import { Router, Request, Response } from "express";
import { pool } from "../db";

const auditLogsRoute = Router();

auditLogsRoute.get("/", async (req: Request, res: Response) => {
  try {
    const { limit = "100", table, action, user } = req.query as { limit?: string, table?: string, action?: string, user?: string };
    const n = Math.max(1, Math.min(1000, Number(limit || 100)));
    
    let whereClause = "1=1";
    const params: any[] = [];
    
    if (table) {
      params.push(table);
      whereClause += ` AND table_name = $${params.length}`;
    }
    
    if (action) {
      params.push(action);
      whereClause += ` AND action = $${params.length}`;
    }
    
    if (user) {
      params.push(user);
      whereClause += ` AND user_id = $${params.length}`;
    }
    
    params.push(n);

    // Using audit_schema.audit_logs as specified in the plan
    const result = await pool.query(
      `SELECT log_id as id, user_id as performed_by, action, table_name as object_table, "timestamp" as created_at, old_value, new_value 
       FROM audit_schema.audit_logs 
       WHERE ${whereClause}
       ORDER BY "timestamp" DESC 
       LIMIT $${params.length}`,
      params
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/audit-logs error:", error);
    return res.status(500).json({ message: "Failed to fetch audit logs" });
  }
});

export default auditLogsRoute;
