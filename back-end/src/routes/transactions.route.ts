import { Router, Request, Response } from "express";
import { pool } from "../db";

const transactionsRoute = Router();

transactionsRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        t.transaction_id,
        t.from_account_id,
        fa.account_number AS from_account_number,
        t.to_account_id,
        ta.account_number AS to_account_number,
        t.amount,
        t.transaction_type,
        t.status,
        t.created_at
      FROM core_schema.transactions t
      LEFT JOIN core_schema.accounts fa
        ON t.from_account_id = fa.account_id
      LEFT JOIN core_schema.accounts ta
        ON t.to_account_id = ta.account_id
      ORDER BY t.transaction_id DESC`,
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

transactionsRoute.post("/transfer", async (req: Request, res: Response) => {
  const { from_account_id, to_account_id, amount } = req.body as {
    from_account_id?: number;
    to_account_id?: number;
    amount?: number;
  };

  if (!from_account_id || !to_account_id || amount === undefined) {
    return res
      .status(400)
      .json({
        message: "from_account_id, to_account_id and amount are required",
      });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fromResult = await client.query(
      `SELECT account_id, balance, status
       FROM core_schema.accounts
       WHERE account_id = $1
       FOR UPDATE`,
      [from_account_id],
    );

    if (fromResult.rows.length === 0) {
      throw new Error("Source account not found");
    }

    const fromAccount = fromResult.rows[0] as {
      account_id: number;
      balance: string;
      status: string;
    };

    if (fromAccount.status !== "ACTIVE") {
      throw new Error("Source account is not ACTIVE");
    }

    if (Number(fromAccount.balance) < amount) {
      throw new Error("Insufficient balance in source account");
    }

    const toResult = await client.query(
      `SELECT account_id, balance, status
       FROM core_schema.accounts
       WHERE account_id = $1
       FOR UPDATE`,
      [to_account_id],
    );

    if (toResult.rows.length === 0) {
      throw new Error("Destination account not found");
    }

    const toAccount = toResult.rows[0] as {
      account_id: number;
      balance: string;
      status: string;
    };

    if (toAccount.status !== "ACTIVE") {
      throw new Error("Destination account is not ACTIVE");
    }

    await client.query(
      `UPDATE core_schema.accounts
       SET balance = balance - $1
       WHERE account_id = $2`,
      [amount, from_account_id],
    );

    await client.query(
      `UPDATE core_schema.accounts
       SET balance = balance + $1
       WHERE account_id = $2`,
      [amount, to_account_id],
    );

    const transactionResult = await client.query(
      `INSERT INTO core_schema.transactions
        (from_account_id, to_account_id, amount, transaction_type, status)
       VALUES
        ($1, $2, $3, 'TRANSFER', 'COMPLETED')
       RETURNING *`,
      [from_account_id, to_account_id, amount],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Transfer successfully",
      transaction: transactionResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    const message = error instanceof Error ? error.message : "Transfer failed";
    return res.status(400).json({ message });
  } finally {
    client.release();
  }
});

transactionsRoute.post("/:id/reverse", async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);

  if (Number.isNaN(transactionId)) {
    return res.status(400).json({ message: "Invalid transaction id" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tRes = await client.query(
      `SELECT transaction_id, status
       FROM core_schema.transactions
       WHERE transaction_id = $1
       FOR UPDATE`,
      [transactionId],
    );

    if (tRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Transaction not found" });
    }

    const tx = tRes.rows[0] as { transaction_id: number; status: string };

    if (tx.status !== "COMPLETED") {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Only COMPLETED transactions can be reversed" });
    }

    const updateRes = await client.query(
      `UPDATE core_schema.transactions
       SET status = 'REVERSED'
       WHERE transaction_id = $1
       RETURNING *`,
      [transactionId],
    );

    await client.query("COMMIT");

    return res
      .status(200)
      .json({
        message: "Transaction reversed",
        transaction: updateRes.rows[0],
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("POST /api/transactions/:id/reverse error:", error);
    return res.status(500).json({ message: "Failed to reverse transaction" });
  } finally {
    client.release();
  }
});

export default transactionsRoute;
