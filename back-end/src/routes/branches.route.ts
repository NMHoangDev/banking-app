import { Router, Request, Response } from "express";
import { pool } from "../db";

const branchesRoute = Router();

branchesRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT branch_id, name, address, phone FROM core_schema.branches ORDER BY branch_id DESC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return res.status(500).json({ message: "Failed to fetch branches" });
  }
});

branchesRoute.post("/", async (req: Request, res: Response) => {
  const { name, address, phone } = req.body as any;
  try {
    const result = await pool.query(
      `INSERT INTO core_schema.branches (name, address, phone) VALUES ($1,$2,$3) RETURNING *`,
      [name, address ?? null, phone ?? null],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/branches error:", error);
    return res.status(500).json({ message: "Failed to create branch" });
  }
});

branchesRoute.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const { name, address, phone } = req.body as any;
  try {
    const result = await pool.query(
      `UPDATE core_schema.branches SET name = COALESCE($1, name), address = COALESCE($2, address), phone = COALESCE($3, phone) WHERE branch_id = $4 RETURNING *`,
      [name ?? null, address ?? null, phone ?? null, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Branch not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/branches/:id error:", error);
    return res.status(500).json({ message: "Failed to update branch" });
  }
});

branchesRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  try {
    const result = await pool.query(
      `DELETE FROM core_schema.branches WHERE branch_id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Branch not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/branches/:id error:", error);
    return res.status(500).json({ message: "Failed to delete branch" });
  }
});

export default branchesRoute;
