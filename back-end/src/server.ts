import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./db";
import authRoute from "./routes/auth.route";
import customersRoute from "./routes/customers.route";
import accountsRoute from "./routes/accounts.route";
import transactionsRoute from "./routes/transactions.route";
import usersRoute from "./routes/users.route";
import billsRoute from "./routes/bills.route";
import cardsRoute from "./routes/cards.route";
import loansRoute from "./routes/loans.route";
import branchesRoute from "./routes/branches.route";
import beneficiariesRoute from "./routes/beneficiaries.route";
import reportsRoute from "./routes/reports.route";
import settingsRoute from "./routes/settings.route";
import auditLogsRoute from "./routes/auditlogs.route";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .concat(defaultAllowedOrigins),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/non-browser requests (no Origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  return res.json({ message: "BankDB API is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/customers", customersRoute);
app.use("/api/accounts", accountsRoute);
app.use("/api/transactions", transactionsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bills", billsRoute);
app.use("/api/cards", cardsRoute);
app.use("/api/loans", loansRoute);
app.use("/api/branches", branchesRoute);
app.use("/api/beneficiaries", beneficiariesRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/audit-logs", auditLogsRoute);

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await testConnection();
});
