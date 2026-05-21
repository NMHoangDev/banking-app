import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { pool } from "../db";

type AuthTokenPayload = {
  user_id: number;
  username: string;
  role_id: number;
  role_name: string;
  customer_id: number | null;
};

function getJwtConfig() {
  const secret = process.env.JWT_SECRET;
  const expiresInRaw = process.env.JWT_EXPIRES_IN ?? "1d";

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  const signOptions: SignOptions = {
    expiresIn: expiresInRaw as SignOptions["expiresIn"],
  };

  return { secret, signOptions };
}

function signToken(payload: AuthTokenPayload): string {
  const { secret, signOptions } = getJwtConfig();
  return jwt.sign(payload, secret, signOptions);
}

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
}

const authRoute = Router();

authRoute.post("/register", async (req: Request, res: Response) => {
  const {
    username,
    password,
    full_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
  } = req.body as {
    username?: string;
    password?: string;
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
  };

  const usernameValue = typeof username === "string" ? username.trim() : "";
  const emailValue = typeof email === "string" ? email.trim() : undefined;
  const phoneValue = typeof phone === "string" ? phone.trim() : undefined;

  if (!usernameValue || !password || !full_name || !date_of_birth) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const usernameCheck = await client.query(
      `SELECT 1 FROM core_schema.users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
      [usernameValue]
    );
    if ((usernameCheck.rowCount ?? 0) > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Username already exists" });
    }

    if (emailValue) {
      const emailCheck = await client.query(
        `SELECT 1 FROM core_schema.customers WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        [emailValue]
      );
      if ((emailCheck.rowCount ?? 0) > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (phoneValue) {
      const phoneCheck = await client.query(
        `SELECT 1 FROM core_schema.customers WHERE phone = $1 LIMIT 1`,
        [phoneValue]
      );
      if ((phoneCheck.rowCount ?? 0) > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Phone already exists" });
      }
    }

    const customerResult = await client.query(
      `INSERT INTO core_schema.customers
        (full_name, date_of_birth, gender, phone, email, address)
       VALUES
        ($1, $2, $3, $4, $5, $6)
       RETURNING customer_id, full_name, date_of_birth, gender, phone, email, address, created_at`,
      [
        full_name,
        date_of_birth,
        gender ?? null,
        phoneValue ?? null,
        emailValue ?? null,
        address ?? null,
      ]
    );
    const customer = customerResult.rows[0] as {
      customer_id: number;
      full_name: string;
      date_of_birth: string;
      gender: string | null;
      phone: string | null;
      email: string | null;
      address: string | null;
      created_at: string;
    };

    let role = await client.query(
      `SELECT role_id, role_name
       FROM core_schema.roles
       WHERE LOWER(role_name) IN ('customer', 'user', 'client')
       ORDER BY role_id ASC
       LIMIT 1`
    );

    if ((role.rowCount ?? 0) === 0) {
      role = await client.query(
        `INSERT INTO core_schema.roles (role_name)
         VALUES ('CUSTOMER')
         RETURNING role_id, role_name`
      );
    }

    const roleRow = role.rows[0] as { role_id: number; role_name: string };
    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      `INSERT INTO core_schema.users
        (username, password_hash, role_id, status, customer_id)
       VALUES
        ($1, $2, $3, 'ACTIVE', $4)
       RETURNING user_id, username, role_id, status, customer_id`,
      [usernameValue, passwordHash, roleRow.role_id, customer.customer_id]
    );

    const user = userResult.rows[0] as {
      user_id: number;
      username: string;
      role_id: number;
      status: string;
      customer_id: number;
    };

    await client.query("COMMIT");

    const tokenPayload: AuthTokenPayload = {
      user_id: user.user_id,
      username: user.username,
      role_id: user.role_id,
      role_name: roleRow.role_name,
      customer_id: user.customer_id,
    };

    const token = signToken(tokenPayload);

    return res.status(201).json({
      message: "Register successfully",
      token,
      user,
      customer: {
        customer_id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
      },
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore rollback failure
    }
    console.error("POST /api/auth/register error:", error);

    const pgError = error as { code?: string; message?: string };
    const message = typeof pgError.message === "string" ? pgError.message : "";

    // Common cases: migration not applied (users.customer_id missing)
    if (pgError.code === "42703" && message.toLowerCase().includes("customer_id")) {
      return res.status(500).json({
        message:
          "Database is missing users.customer_id. Please run migration back-end/src/migrations/001_add_customer_id_to_users.sql",
      });
    }

    // Unique violation fallback (race-condition safety)
    if (pgError.code === "23505") {
      return res.status(409).json({ message: "Duplicate data (unique constraint)" });
    }

    return res.status(500).json({ message: "Register failed" });
  } finally {
    client.release();
  }
});

authRoute.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  const identifier = typeof username === "string" ? username.trim() : "";

  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  try {
    const result = await pool.query(
      `SELECT
        u.user_id,
        u.username,
        u.password_hash,
        u.role_id,
        u.status,
        u.customer_id,
        r.role_name,
        c.full_name,
        c.email,
        c.phone,
        c.address
      FROM core_schema.users u
      LEFT JOIN core_schema.roles r
        ON u.role_id = r.role_id
      LEFT JOIN core_schema.customers c
        ON u.customer_id = c.customer_id
      WHERE LOWER(u.username) = LOWER($1)
         OR LOWER(c.email) = LOWER($1)`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const row = result.rows[0] as {
      user_id: number;
      username: string;
      password_hash: string;
      role_id: number;
      status: string;
      customer_id: number | null;
      role_name: string | null;
      full_name: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
    };

    if (row.status !== "ACTIVE") {
      return res.status(403).json({ message: "Account is not active" });
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const tokenPayload: AuthTokenPayload = {
      user_id: row.user_id,
      username: row.username,
      role_id: row.role_id,
      role_name: row.role_name ?? "CUSTOMER",
      customer_id: row.customer_id,
    };

    const token = signToken(tokenPayload);

    return res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        user_id: row.user_id,
        username: row.username,
        role_id: row.role_id,
        role_name: row.role_name ?? "CUSTOMER",
        status: row.status,
        customer_id: row.customer_id ?? undefined,
        full_name: row.full_name ?? undefined,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        address: row.address ?? undefined,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});

authRoute.get("/me", async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const { secret } = getJwtConfig();
    const decoded = jwt.verify(token, secret) as JwtPayload | AuthTokenPayload;

    const userId = typeof decoded === "object" ? (decoded as AuthTokenPayload).user_id : undefined;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const result = await pool.query(
      `SELECT
        u.user_id,
        u.username,
        u.role_id,
        u.status,
        u.customer_id,
        r.role_name,
        c.full_name,
        c.email,
        c.phone,
        c.address
      FROM core_schema.users u
      LEFT JOIN core_schema.roles r
        ON u.role_id = r.role_id
      LEFT JOIN core_schema.customers c
        ON u.customer_id = c.customer_id
      WHERE u.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const row = result.rows[0] as {
      user_id: number;
      username: string;
      role_id: number;
      status: string;
      customer_id: number | null;
      role_name: string | null;
      full_name: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
    };

    return res.status(200).json({
      user_id: row.user_id,
      username: row.username,
      role_id: row.role_id,
      status: row.status,
      customer_id: row.customer_id ?? undefined,
      role_name: row.role_name ?? "CUSTOMER",
      full_name: row.full_name ?? undefined,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      address: row.address ?? undefined,
    });
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default authRoute;
