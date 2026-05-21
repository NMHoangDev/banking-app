import { Router, Request, Response } from "express";
import { pool } from "../db";

const settingsRoute = Router();

settingsRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT key, value FROM core_schema.settings`,
    );
    const obj: Record<string, string> = {};
    for (const row of result.rows) obj[row.key] = row.value;
    return res.status(200).json(obj);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return res.status(500).json({ message: "Failed to fetch settings" });
  }
});

settingsRoute.put("/", async (req: Request, res: Response) => {
  const updates = req.body as Record<string, string>;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [key, value] of Object.entries(updates)) {
      await client.query(
        `INSERT INTO core_schema.settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, value],
      );
    }
    await client.query("COMMIT");
    return res.status(200).json(updates);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("PUT /api/settings error:", error);
    return res.status(500).json({ message: "Failed to update settings" });
  } finally {
    client.release();
  }
});

export default settingsRoute;
