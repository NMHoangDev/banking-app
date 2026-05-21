import { Router, Request, Response } from "express";
import { pool } from "../db";

type MonthBar = {
  month: string; // YYYY-MM
  capital: number; // incoming volume
  spending: number; // outgoing volume
};

type PortfolioItem = {
  name: string;
  percent: number;
  value: number;
};

type ReportItem = {
  id: string;
  name: string;
  type: "Financial" | "Revenue" | "Risk" | "Audit";
  date: string; // ISO string
  size_mb: number;
  creator: string;
  status: "Completed";
};

const reportsRoute = Router();

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(num)));
}

reportsRoute.get("/summary", async (req: Request, res: Response) => {
  const months = clampInt(req.query.months, 1, 24, 6);

  try {
    const [assetsResult, customersResult, accountsResult] = await Promise.all([
      pool.query(
        `SELECT
          COALESCE(SUM(a.balance), 0) AS total_assets,
          COALESCE(SUM(CASE WHEN a.status = 'ACTIVE' THEN a.balance ELSE 0 END), 0) AS total_assets_active
        FROM core_schema.accounts a`
      ),
      pool.query(`SELECT COUNT(*)::int AS customer_count FROM core_schema.customers`),
      pool.query(
        `SELECT
          COUNT(*)::int AS account_count,
          COUNT(*) FILTER (WHERE status = 'ACTIVE')::int AS active_account_count
        FROM core_schema.accounts`
      ),
    ]);

    const totalAssets = Number(assetsResult.rows[0]?.total_assets ?? 0);
    const totalAssetsActive = Number(assetsResult.rows[0]?.total_assets_active ?? 0);
    const customerCount = Number(customersResult.rows[0]?.customer_count ?? 0);
    const accountCount = Number(accountsResult.rows[0]?.account_count ?? 0);
    const activeAccountCount = Number(accountsResult.rows[0]?.active_account_count ?? 0);

    const volumeResult = await pool.query(
      `SELECT
        COALESCE(SUM(amount), 0) AS total_volume,
        COUNT(*)::int AS transaction_count
      FROM core_schema.transactions
      WHERE created_at >= (NOW() - ($1::int || ' months')::interval)`,
      [months]
    );
    const transactionVolume = Number(volumeResult.rows[0]?.total_volume ?? 0);
    const transactionCount = Number(volumeResult.rows[0]?.transaction_count ?? 0);

    const directionBarsResult = await pool.query(
      `WITH months AS (
        SELECT
          date_trunc('month', (NOW() - (($1::int - 1) || ' months')::interval)) AS start_month,
          date_trunc('month', NOW()) AS end_month
      ),
      series AS (
        SELECT generate_series(start_month, end_month, interval '1 month') AS month_start
        FROM months
      ),
      agg AS (
        SELECT
          date_trunc('month', t.created_at) AS month_start,
          COALESCE(SUM(CASE WHEN t.to_account_id IS NOT NULL THEN t.amount ELSE 0 END), 0) AS incoming,
          COALESCE(SUM(CASE WHEN t.from_account_id IS NOT NULL THEN t.amount ELSE 0 END), 0) AS outgoing
        FROM core_schema.transactions t
        WHERE t.created_at >= (SELECT start_month FROM months)
        GROUP BY 1
      )
      SELECT
        to_char(s.month_start, 'YYYY-MM') AS month,
        COALESCE(a.incoming, 0) AS incoming,
        COALESCE(a.outgoing, 0) AS outgoing
      FROM series s
      LEFT JOIN agg a
        ON a.month_start = s.month_start
      ORDER BY s.month_start ASC`,
      [months]
    );

    const bars: MonthBar[] = (directionBarsResult.rows as Array<{
      month: string;
      incoming: string | number;
      outgoing: string | number;
    }>).map((row) => ({
      month: row.month,
      capital: Number(row.incoming ?? 0),
      spending: Number(row.outgoing ?? 0),
    }));

    const portfolioResult = await pool.query(
      `SELECT
        COALESCE(t.type_name, 'UNKNOWN') AS type_name,
        COALESCE(SUM(a.balance), 0) AS balance_sum
      FROM core_schema.accounts a
      LEFT JOIN core_schema.account_types t
        ON a.type_id = t.type_id
      GROUP BY 1
      ORDER BY balance_sum DESC`
    );

    const portfolioRows = portfolioResult.rows as Array<{ type_name: string; balance_sum: string | number }>;
    const portfolioTotal = portfolioRows.reduce((sum, row) => sum + Number(row.balance_sum ?? 0), 0);
    const portfolio: PortfolioItem[] =
      portfolioTotal > 0
        ? portfolioRows.slice(0, 4).map((row) => {
            const value = Number(row.balance_sum ?? 0);
            const percent = (value / portfolioTotal) * 100;
            return { name: row.type_name, value, percent };
          })
        : [];

    const reports: ReportItem[] = bars
      .slice()
      .reverse()
      .slice(0, Math.min(months, 12))
      .map((bar) => {
        const id = `REP-${bar.month}`;
        const date = new Date(`${bar.month}-01T00:00:00.000Z`);
        const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
        const sizeMb = Math.max(0.2, Math.round(((bar.capital + bar.spending) / 1_000_000_000) * 10) / 10);
        return {
          id,
          name: `Báo cáo giao dịch tháng ${bar.month}`,
          type: "Financial",
          date: lastDay.toISOString(),
          size_mb: sizeMb,
          creator: "System",
          status: "Completed",
        };
      });

    return res.status(200).json({
      months,
      overview: {
        total_assets: totalAssets,
        total_assets_active: totalAssetsActive,
        customer_count: customerCount,
        account_count: accountCount,
        active_account_count: activeAccountCount,
        transaction_volume: transactionVolume,
        transaction_count: transactionCount,
      },
      bars,
      portfolio,
      reports,
    });
  } catch (error) {
    console.error("GET /api/reports/summary error:", error);
    return res.status(500).json({ message: "Failed to fetch reports summary" });
  }
});

export default reportsRoute;
