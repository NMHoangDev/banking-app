import { Router, Request, Response } from "express";
import { pool } from "../db";

const cardsRoute = Router();

cardsRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT card_id, card_number, card_type, expiry_date, status, linked_account FROM core_schema.cards ORDER BY card_id DESC`,
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/cards error:", error);
    return res.status(500).json({ message: "Failed to fetch cards" });
  }
});

cardsRoute.post("/", async (req: Request, res: Response) => {
  const { card_number, card_type, expiry_date, status, linked_account } =
    req.body as any;
  try {
    const result = await pool.query(
      `INSERT INTO core_schema.cards (card_number, card_type, expiry_date, status, linked_account) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        card_number,
        card_type ?? null,
        expiry_date ?? null,
        status ?? "ACTIVE",
        linked_account ?? null,
      ],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/cards error:", error);
    return res.status(500).json({ message: "Failed to create card" });
  }
});

cardsRoute.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const { card_type, expiry_date, status } = req.body as any;
  try {
    const result = await pool.query(
      `UPDATE core_schema.cards SET card_type = COALESCE($1, card_type), expiry_date = COALESCE($2, expiry_date), status = COALESCE($3, status) WHERE card_id = $4 RETURNING *`,
      [card_type ?? null, expiry_date ?? null, status ?? null, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Card not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/cards/:id error:", error);
    return res.status(500).json({ message: "Failed to update card" });
  }
});

cardsRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  try {
    const result = await pool.query(
      `DELETE FROM core_schema.cards WHERE card_id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Card not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/cards/:id error:", error);
    return res.status(500).json({ message: "Failed to delete card" });
  }
});

export default cardsRoute;
