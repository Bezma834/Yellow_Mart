import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { OAuth2Client } from "google-auth-library";
import pool from "../db/db";
import { signToken } from "../utils/token";

// Known Google OAuth clients (local dev + production frontend), plus any
// extra client IDs supplied via env (GOOGLE_CLIENT_IDS, comma-separated).
// The deployed frontend's client ID MUST be in this list or Google token
// verification fails with "Wrong recipient, payload audience != requiredAudience".
const HARDCODED_CLIENT_IDS = [
  "353855053860-khcclj6auvae5enurefp0b4g6nd1fcf2.apps.googleusercontent.com",
  "353855053860-8po57mngnlgrd7m0moniht4bor8jdo37.apps.googleusercontent.com"
];

const envClientIds = (process.env.GOOGLE_CLIENT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const GOOGLE_CLIENT_IDS = [
  ...new Set([
    ...HARDCODED_CLIENT_IDS,
    ...envClientIds,
    ...(process.env.GOOGLE_CLIENT_ID ? [process.env.GOOGLE_CLIENT_ID] : [])
  ])
];

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

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_IDS
    });
  } catch (verifyError) {
    console.error(
      "GOOGLE ID TOKEN VERIFICATION FAILED:",
      (verifyError as Error)?.message
    );
    throw new AuthError(
      "Google sign-in could not be verified. Please try again.",
      400
    );
  }

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
    let username = email.split("@")[0] || `user${Date.now()}`;

    // Google accounts have no password: store an unguessable random hash so
    // the password column stays NOT NULL-safe.
    const googlePasswordHash = await bcrypt.hash(
      randomBytes(24).toString("hex"),
      10
    );

    // Email prefixes can collide with existing usernames (e.g. "john" taken
    // by a different account) - append a short suffix to keep the unique
    // constraint happy.
    const usernameTaken = await pool.query(
      `SELECT 1 FROM users WHERE username = $1`,
      [username]
    );

    if (usernameTaken.rows.length > 0) {
      username = `${username}${Date.now().toString(36).slice(-4)}`;
    }

    const result = await pool.query(
      `
      INSERT INTO users
      (
        username,
        fullname,
        email,
        password,
        avatar,
        role,
        email_verified
      )

      VALUES
      ($1,$2,$3,$4,$5,$6,$7)

      RETURNING *
      `,
      [username, fullname, email, googlePasswordHash, avatar, "user", true]
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
