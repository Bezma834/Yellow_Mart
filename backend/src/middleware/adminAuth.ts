import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Server-side gate for all /api/admin routes.
// Rejects missing/invalid tokens and any non-admin role.
export const adminAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded?.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (String(decoded.role).trim() !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
