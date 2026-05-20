import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function testConnection(): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected:", result.rows[0]);
  } catch (error) {
    const pgError = error as { code?: string; message?: string };

    if (pgError.code === "28P01") {
      console.error("PostgreSQL authentication failed (code 28P01).");
      console.error(
        "Please verify DB_USER and DB_PASSWORD in back-end/.env match your PostgreSQL credentials."
      );
    } else {
      console.error("PostgreSQL connection error:", error);
    }

    process.exit(1);
  }
}
