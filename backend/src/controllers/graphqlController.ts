import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

export const proxyGraphQL = async (req: Request, res: Response) => {
  const { query, variables } = req.body || {};

  if (!query) {
    return res.status(400).json({
      errors: [{ message: "Missing query" }],
    });
  }

  const headers: Record<string, string> = {
    "x-hasura-admin-secret": process.env.HASURA_SECRET || "",
  };

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as any;

      if (decoded?.id) {
        headers["x-hasura-user-id"] = String(decoded.id);
      }

      if (decoded?.role) {
        headers["x-hasura-role"] = String(decoded.role);
      }
    } catch {}
  }

  try {
    const response = await axios.post(
      process.env.HASURA_URL || "",
      { query, variables },
      { headers }
    );

    return res.status(response.status).json(response.data);
  } catch (err: any) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    return res.status(502).json({
      errors: [{ message: "GraphQL proxy failed to reach the database" }],
    });
  }
};
