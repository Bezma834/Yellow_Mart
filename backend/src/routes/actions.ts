import { Router } from "express";
import { loginUser, googleLoginUser, AuthError } from "../services/authService";

const router = Router();

// ==============================
// HASURA ACTION WEBHOOKS
// Hasura calls these with the action payload:
//   { action: { name }, input: {...}, session_variables: {...}, request_query }
// Success: return the action output type JSON (200).
// Error:   return non-2xx with { message, extensions } - Hasura surfaces
//          `message` as the GraphQL error message.
// ==============================

const actionError = (err: any) => {
  const status = err instanceof AuthError ? err.statusCode : 500;
  return {
    status,
    body: {
      message: err?.message || "Action failed",
      extensions: { code: status === 400 ? "invalid-input" : "internal-error" }
    }
  };
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body?.input || {};
    const result = await loginUser(email, password);
    return res.json(result);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
});

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body?.input || {};
    const result = await googleLoginUser(token);
    return res.json(result);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
});

export default router;
