import { Router, Request, Response } from "express";
import { pool } from "../db";

const usersRoute = Router();

usersRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        u.user_id,
        u.username,
        u.status,
        u.customer_id,
        r.role_name,
        c.full_name,
        c.email,
        c.phone,
        c.created_at AS customer_created_at
      FROM core_schema.users u
      LEFT JOIN core_schema.roles r
        ON u.role_id = r.role_id
      LEFT JOIN core_schema.customers c
        ON u.customer_id = c.customer_id
      ORDER BY u.user_id DESC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default usersRoute;

