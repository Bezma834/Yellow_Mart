import jwt from "jsonwebtoken";
import crypto from "crypto";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const signToken = (user: any) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

export const generateToken = () =>
  crypto.randomBytes(32).toString("hex");

export const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");
