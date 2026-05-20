import { Router, Request, Response } from "express";
import { pool } from "../db";

const billsRoute = Router();

billsRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT bill_id, bill_type, amount, due_date, status FROM core_schema.bills ORDER BY bill_id DESC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/bills error:", error);
    return res.status(500).json({ message: "Failed to fetch bills" });
  }
});

billsRoute.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const result = await pool.query(
      `SELECT bill_id, bill_type, amount, due_date, status FROM core_schema.bills WHERE bill_id = $1`,
      [id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Bill not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/bills/:id error:", error);
    return res.status(500).json({ message: "Failed to fetch bill" });
  }
});

billsRoute.post("/", async (req: Request, res: Response) => {
  const { bill_type, amount, due_date, status } = req.body as any;
  try {
    const result = await pool.query(
      `INSERT INTO core_schema.bills (bill_type, amount, due_date, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [bill_type, amount, due_date ?? null, status ?? "UNPAID"],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/bills error:", error);
    return res.status(500).json({ message: "Failed to create bill" });
  }
});

billsRoute.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const { bill_type, amount, due_date, status } = req.body as any;
  try {
    const result = await pool.query(
      `UPDATE core_schema.bills SET bill_type = COALESCE($1, bill_type), amount = COALESCE($2, amount), due_date = COALESCE($3, due_date), status = COALESCE($4, status) WHERE bill_id = $5 RETURNING *`,
      [bill_type ?? null, amount ?? null, due_date ?? null, status ?? null, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Bill not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/bills/:id error:", error);
    return res.status(500).json({ message: "Failed to update bill" });
  }
});

billsRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const result = await pool.query(
      `DELETE FROM core_schema.bills WHERE bill_id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Bill not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/bills/:id error:", error);
    return res.status(500).json({ message: "Failed to delete bill" });
  }
});

export default billsRoute;
