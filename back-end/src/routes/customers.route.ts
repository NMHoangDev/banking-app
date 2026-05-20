import { Router, Request, Response } from "express";
import { pool } from "../db";

const customersRoute = Router();

customersRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT customer_id, full_name, date_of_birth, gender, phone, email, address, created_at
       FROM core_schema.customers
       ORDER BY customer_id DESC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return res.status(500).json({ message: "Failed to fetch customers" });
  }
});

customersRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.id);

    if (Number.isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer id" });
    }

    const result = await pool.query(
      `SELECT customer_id, full_name, date_of_birth, gender, phone, email, address, created_at
       FROM core_schema.customers
       WHERE customer_id = $1`,
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/customers/:id error:", error);
    return res.status(500).json({ message: "Failed to fetch customer" });
  }
});

customersRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { full_name, date_of_birth, gender, phone, email, address } = req.body as {
      full_name?: string;
      date_of_birth?: string;
      gender?: string;
      phone?: string;
      email?: string;
      address?: string;
    };

    const result = await pool.query(
      `INSERT INTO core_schema.customers (full_name, date_of_birth, gender, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [full_name, date_of_birth, gender, phone, email, address]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return res.status(500).json({ message: "Failed to create customer" });
  }
});

customersRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.id);

    if (Number.isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer id" });
    }

    const { full_name, date_of_birth, gender, phone, email, address } = req.body as {
      full_name?: string;
      date_of_birth?: string;
      gender?: string;
      phone?: string;
      email?: string;
      address?: string;
    };

    const result = await pool.query(
      `UPDATE core_schema.customers
       SET full_name = $1,
           date_of_birth = $2,
           gender = $3,
           phone = $4,
           email = $5,
           address = $6
       WHERE customer_id = $7
       RETURNING *`,
      [full_name, date_of_birth, gender, phone, email, address, customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/customers/:id error:", error);
    return res.status(500).json({ message: "Failed to update customer" });
  }
});

customersRoute.delete("/:id", async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.id);

    if (Number.isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer id" });
    }

    const result = await pool.query(
      `DELETE FROM core_schema.customers
       WHERE customer_id = $1
       RETURNING *`,
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("DELETE /api/customers/:id error:", error);
    return res.status(500).json({ message: "Failed to delete customer" });
  }
});

export default customersRoute;
