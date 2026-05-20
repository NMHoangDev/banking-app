import { Router, Request, Response } from "express";
import { pool } from "../db";

const accountsRoute = Router();

accountsRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        a.account_id,
        a.customer_id,
        a.type_id,
        a.account_number,
        a.balance,
        a.status,
        a.created_at,
        c.full_name,
        t.type_name
      FROM core_schema.accounts a
      LEFT JOIN core_schema.customers c
        ON a.customer_id = c.customer_id
      LEFT JOIN core_schema.account_types t
        ON a.type_id = t.type_id
      ORDER BY a.account_id DESC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/accounts error:", error);
    return res.status(500).json({ message: "Failed to fetch accounts" });
  }
});

accountsRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const accountId = Number(req.params.id);

    if (Number.isNaN(accountId)) {
      return res.status(400).json({ message: "Invalid account id" });
    }

    const result = await pool.query(
      `SELECT
        a.account_id,
        a.customer_id,
        a.type_id,
        a.account_number,
        a.balance,
        a.status,
        a.created_at,
        c.full_name,
        t.type_name
      FROM core_schema.accounts a
      LEFT JOIN core_schema.customers c
        ON a.customer_id = c.customer_id
      LEFT JOIN core_schema.account_types t
        ON a.type_id = t.type_id
      WHERE a.account_id = $1`,
      [accountId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/accounts/:id error:", error);
    return res.status(500).json({ message: "Failed to fetch account" });
  }
});

accountsRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { customer_id, type_id, account_number, balance, status } = req.body as {
      customer_id?: number;
      type_id?: number;
      account_number?: string;
      balance?: number;
      status?: string;
    };

    const finalBalance = typeof balance === "number" ? balance : 0;
    const finalStatus = status ?? "ACTIVE";

    const result = await pool.query(
      `INSERT INTO core_schema.accounts (customer_id, type_id, account_number, balance, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_id, type_id, account_number, finalBalance, finalStatus]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/accounts error:", error);
    return res.status(500).json({ message: "Failed to create account" });
  }
});

export default accountsRoute;
