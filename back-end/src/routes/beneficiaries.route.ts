import { Router, Request, Response } from "express";
import { pool } from "../db";

const beneficiariesRoute = Router();

beneficiariesRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT beneficiary_id, name, account_number, bank_name, created_at FROM core_schema.beneficiaries ORDER BY beneficiary_id DESC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/beneficiaries error:", error);
    return res.status(500).json({ message: "Failed to fetch beneficiaries" });
  }
});

beneficiariesRoute.post("/", async (req: Request, res: Response) => {
  const { name, account_number, bank_name } = req.body as any;
  try {
    const result = await pool.query(
      `INSERT INTO core_schema.beneficiaries (name, account_number, bank_name) VALUES ($1,$2,$3) RETURNING *`,
      [name, account_number, bank_name ?? null],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/beneficiaries error:", error);
    return res.status(500).json({ message: "Failed to create beneficiary" });
  }
});

beneficiariesRoute.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const { name, account_number, bank_name } = req.body as any;
  try {
    const result = await pool.query(
      `UPDATE core_schema.beneficiaries SET name = COALESCE($1, name), account_number = COALESCE($2, account_number), bank_name = COALESCE($3, bank_name) WHERE beneficiary_id = $4 RETURNING *`,
      [name ?? null, account_number ?? null, bank_name ?? null, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Beneficiary not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/beneficiaries/:id error:", error);
    return res.status(500).json({ message: "Failed to update beneficiary" });
  }
});

beneficiariesRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  try {
    const result = await pool.query(
      `DELETE FROM core_schema.beneficiaries WHERE beneficiary_id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Beneficiary not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/beneficiaries/:id error:", error);
    return res.status(500).json({ message: "Failed to delete beneficiary" });
  }
});

export default beneficiariesRoute;
