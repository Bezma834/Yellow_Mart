// One-off admin password rotation script (run via tsx, from backend/)
// Generates a strong random password, bcrypt-hashes it, and updates the
// admin user row. Writes credentials to /tmp/opencode/admin-credentials.txt
import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../src/db/db";

const ADMIN_EMAIL = "admin@yellowmart.com";

const generateStrongPassword = (): string => {
  // 24 chars of base64url randomness (~144 bits of entropy)
  const raw = crypto.randomBytes(18).toString("base64url");
  // Guarantee at least one digit, one upper, one lower, one symbol
  const extra = "Aa1!";
  const shuffled = (raw + extra)
    .split("")
    .sort(() => crypto.randomInt(-1, 2))
    .join("");
  return shuffled;
};

(async () => {
  try {
    const existing = await pool.query(
      "SELECT id, email, role FROM users WHERE email = $1",
      [ADMIN_EMAIL]
    );
    if (existing.rows.length === 0) {
      console.error(`No user found with email ${ADMIN_EMAIL}`);
      process.exit(1);
    }
    const admin = existing.rows[0];
    console.log(`Admin found: id=${admin.id} role=${admin.role}`);

    const newPassword = generateStrongPassword();
    const hash = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hash,
      admin.id,
    ]);

    const fs = await import("fs");
    fs.writeFileSync(
      "/tmp/opencode/admin-credentials.txt",
      `email: ${ADMIN_EMAIL}\npassword: ${newPassword}\nrole: ${admin.role}\nid: ${admin.id}\nrotated: ${new Date().toISOString()}\n`,
      { mode: 0o600 }
    );

    console.log("Password rotated successfully.");
    console.log(`Credentials saved to /tmp/opencode/admin-credentials.txt`);
    console.log(`New password length: ${newPassword.length}`);
  } catch (err) {
    console.error("Rotation failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();