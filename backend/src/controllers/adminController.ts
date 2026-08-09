import { Request, Response } from "express";
import pool from "../db/db";

// ==============================
// DASHBOARD STATS
// ==============================

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [
      businesses,
      pending,
      approved,
      rejected,
      categories,
      users,
      featured
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS count FROM businesses`),
      pool.query(`SELECT COUNT(*)::int AS count FROM businesses WHERE status = 'pending'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM businesses WHERE status = 'approved'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM businesses WHERE status = 'rejected'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM categories`),
      pool.query(`SELECT COUNT(*)::int AS count FROM users`),
      pool.query(`SELECT COUNT(*)::int AS count FROM businesses WHERE featured = true`)
    ]);

    return res.json({
      businesses: businesses.rows[0].count,
      pending: pending.rows[0].count,
      approved: approved.rows[0].count,
      rejected: rejected.rows[0].count,
      categories: categories.rows[0].count,
      users: users.rows[0].count,
      featured: featured.rows[0].count
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return res.status(500).json({ error: "Could not load stats" });
  }
};

// ==============================
// BUSINESSES
// ==============================

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.name,
        b.description,
        b.phone,
        b.address,
        b.city,
        b.image,
        b.status,
        b.featured,
        b.views,
        b.lat,
        b.lng,
        c.name AS category_name,
        u.fullname AS owner_name,
        u.email AS owner_email
      FROM businesses b
      LEFT JOIN categories c ON c.id = b.category_id
      LEFT JOIN users u ON u.id = b.owner_id
      WHERE ($1::text IS NULL OR b.status = $1)
      ORDER BY b.name ASC
      `,
      [status || null]
    );

    return res.json({ businesses: result.rows });
  } catch (error: any) {
    console.error("Admin Businesses Error:", error);
    return res.status(500).json({ error: "Could not load businesses" });
  }
};

const setBusinessStatus = async (
  id: string,
  status: string,
  res: Response
) => {
  const result = await pool.query(
    `
    UPDATE businesses
    SET status = $1
    WHERE id = $2
    RETURNING id, name, status
    `,
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Business not found" });
  }

  return res.json({ business: result.rows[0] });
};

export const approveBusiness = async (req: Request, res: Response) => {
  try {
    return await setBusinessStatus(String(req.params.id), "approved", res);
  } catch (error: any) {
    console.error("Approve Business Error:", error);
    return res.status(500).json({ error: "Could not approve business" });
  }
};

export const rejectBusiness = async (req: Request, res: Response) => {
  try {
    return await setBusinessStatus(String(req.params.id), "rejected", res);
  } catch (error: any) {
    console.error("Reject Business Error:", error);
    return res.status(500).json({ error: "Could not reject business" });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM businesses
      WHERE id = $1
      RETURNING id
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Business not found" });
    }

    return res.json({ deleted: true });
  } catch (error: any) {
    console.error("Delete Business Error:", error);
    return res.status(500).json({ error: "Could not delete business" });
  }
};

// ==============================
// CATEGORIES
// ==============================

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT
        c.id,
        c.name,
        c.icon,
        COUNT(b.id)::int AS business_count
      FROM categories c
      LEFT JOIN businesses b ON b.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
      `
    );

    return res.json({ categories: result.rows });
  } catch (error: any) {
    console.error("Admin Categories Error:", error);
    return res.status(500).json({ error: "Could not load categories" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO categories (name, icon)
      VALUES ($1, $2)
      RETURNING id, name, icon
      `,
      [String(name).trim(), icon || ""]
    );

    return res.status(201).json({ category: result.rows[0] });
  } catch (error: any) {
    console.error("Create Category Error:", error);
    if (error?.code === "23505") {
      return res.status(400).json({ error: "A category with this name already exists" });
    }
    return res.status(500).json({ error: "Could not create category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const result = await pool.query(
      `
      UPDATE categories
      SET name = $1, icon = $2
      WHERE id = $3
      RETURNING id, name, icon
      `,
      [String(name).trim(), icon || "", req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json({ category: result.rows[0] });
  } catch (error: any) {
    console.error("Update Category Error:", error);
    if (error?.code === "23505") {
      return res.status(400).json({ error: "A category with this name already exists" });
    }
    return res.status(500).json({ error: "Could not update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json({ deleted: true });
  } catch (error: any) {
    console.error("Delete Category Error:", error);
    if (error?.code === "23503") {
      return res.status(400).json({
        error: "Cannot delete: businesses are using this category"
      });
    }
    return res.status(500).json({ error: "Could not delete category" });
  }
};

// ==============================
// USERS
// ==============================

export const getUsers = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string | undefined) || "";

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        fullname,
        email,
        avatar,
        phone,
        role,
        created_at
      FROM users
      WHERE
        $1 = ''
        OR email ILIKE '%' || $1 || '%'
        OR username ILIKE '%' || $1 || '%'
        OR fullname ILIKE '%' || $1 || '%'
      ORDER BY created_at DESC
      `,
      [search]
    );

    return res.json({ users: result.rows });
  } catch (error: any) {
    console.error("Admin Users Error:", error);
    return res.status(500).json({ error: "Could not load users" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;

    const validRoles = ["user", "owner", "admin"];

    if (!role || !validRoles.includes(String(role).trim())) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, username, email, role
      `,
      [String(role).trim(), req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: result.rows[0] });
  } catch (error: any) {
    console.error("Update User Role Error:", error);
    return res.status(500).json({ error: "Could not update user role" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ deleted: true });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ error: "Could not delete user" });
  }
};
