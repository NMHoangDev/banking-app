import { Router, Request, Response } from "express";
import { pool } from "../db";

const loansRoute = Router();

loansRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT loan_id, amount, interest_rate, start_date, end_date, status FROM core_schema.loans ORDER BY loan_id DESC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/loans error:", error);
    return res.status(500).json({ message: "Failed to fetch loans" });
  }
});

loansRoute.post("/", async (req: Request, res: Response) => {
  const { amount, interest_rate, start_date, end_date, status } =
    req.body as any;
  try {
    const result = await pool.query(
      `INSERT INTO core_schema.loans (amount, interest_rate, start_date, end_date, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        amount,
        interest_rate ?? null,
        start_date ?? null,
        end_date ?? null,
        status ?? "ACTIVE",
      ],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/loans error:", error);
    return res.status(500).json({ message: "Failed to create loan" });
  }
});

loansRoute.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const { amount, interest_rate, start_date, end_date, status } =
    req.body as any;
  try {
    const result = await pool.query(
      `UPDATE core_schema.loans SET amount = COALESCE($1, amount), interest_rate = COALESCE($2, interest_rate), start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date), status = COALESCE($5, status) WHERE loan_id = $6 RETURNING *`,
      [
        amount ?? null,
        interest_rate ?? null,
        start_date ?? null,
        end_date ?? null,
        status ?? null,
        id,
      ],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Loan not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/loans/:id error:", error);
    return res.status(500).json({ message: "Failed to update loan" });
  }
});

loansRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  try {
    const result = await pool.query(
      `DELETE FROM core_schema.loans WHERE loan_id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Loan not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/loans/:id error:", error);
    return res.status(500).json({ message: "Failed to delete loan" });
  }
});

export default loansRoute;
