import { Router, Request, Response } from "express";
import { pool } from "../db";

const usersRoute = Router();

usersRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.status, u.customer_id, r.role_name
       FROM core_schema.users u
       LEFT JOIN core_schema.roles r ON u.role_id = r.role_id
       ORDER BY u.user_id DESC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

usersRoute.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.status, u.customer_id, r.role_name
       FROM core_schema.users u
       LEFT JOIN core_schema.roles r ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/users/:id error:", error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

usersRoute.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const { status, role_id } = req.body as { status?: string; role_id?: number };

  try {
    const result = await pool.query(
      `UPDATE core_schema.users SET status = COALESCE($1, status), role_id = COALESCE($2, role_id)
       WHERE user_id = $3 RETURNING *`,
      [status ?? null, role_id ?? null, id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
});

usersRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const result = await pool.query(
      `DELETE FROM core_schema.users WHERE user_id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
});

export default usersRoute;
