import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../db/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Accept both OAuth clients (local dev + production frontend)
const GOOGLE_CLIENT_IDS = [
  "353855053860-khcclj6auvae5enurefp0b4g6nd1fcf2.apps.googleusercontent.com",
  "353855053860-8po57mngnlgrd7m0moniht4bor8jdo37.apps.googleusercontent.com"
].filter(Boolean);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_IDS[0];

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface AuthUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  role?: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const signToken = (user: any) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  if (!email || !password) {
    throw new AuthError("Email and password are required");
  }

  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    OR username = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new AuthError("User not found");
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AuthError("Incorrect password");
  }

  return {
    token: signToken(user),
    user: {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      role: user.role
    }
  };
};

export const googleLoginUser = async (
  googleToken: string
): Promise<AuthResult> => {
  if (!googleToken) {
    throw new AuthError("Google token missing");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: GOOGLE_CLIENT_IDS
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AuthError("Invalid Google token");
  }

  const email = payload.email;
  const fullname = payload.name || "Google User";
  const avatar = payload.picture || null;

  if (!email) {
    throw new AuthError("Google email not found");
  }

  // Check if user already exists
  const existing = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  let user;

  if (existing.rows.length > 0) {
    user = existing.rows[0];
  } else {
    const username = email.split("@")[0];

    const result = await pool.query(
      `
      INSERT INTO users
      (
        username,
        fullname,
        email,
        avatar,
        role
      )

      VALUES
      ($1,$2,$3,$4,$5)

      RETURNING *
      `,
      [username, fullname, email, avatar, "user"]
    );

    user = result.rows[0];
  }

  return {
    token: signToken(user),
    user: {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      role: user.role
    }
  };
};
