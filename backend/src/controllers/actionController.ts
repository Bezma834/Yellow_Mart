import { Request, Response } from "express";
import { loginUser, googleLoginUser, AuthError } from "../services/authService";
import {
  signup,
  checkEmail,
  forgotPassword,
  resetPassword,
  changePassword
} from "./authController";
import { deleteAccount } from "./userController";

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

// Action payload helpers: `input` holds the action arguments, and
// `session_variables["x-hasura-user-id"]` holds the authenticated user
// (set by the backend GraphQL proxy from the user's JWT).
const inputOf = (req: Request) => req.body?.input || {};
const sessionUserId = (req: Request) =>
  req.body?.session_variables?.["x-hasura-user-id"] || null;

export const actionLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = inputOf(req);
    const result = await loginUser(email, password);
    return res.json(result);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionGoogle = async (req: Request, res: Response) => {
  try {
    const { token } = inputOf(req);
    const result = await googleLoginUser(token);
    return res.json(result);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionSignup = async (req: Request, res: Response) => {
  try {
    return await signup({ body: inputOf(req) } as any, res);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionCheckEmail = async (req: Request, res: Response) => {
  try {
    return await checkEmail({ body: inputOf(req) } as any, res);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionForgotPassword = async (req: Request, res: Response) => {
  try {
    return await forgotPassword({ body: inputOf(req) } as any, res);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionResetPassword = async (req: Request, res: Response) => {
  try {
    return await resetPassword({ body: inputOf(req) } as any, res);
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionChangePassword = async (req: Request, res: Response) => {
  try {
    return await changePassword(
      { body: inputOf(req), user: { id: sessionUserId(req) } } as any,
      res
    );
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};

export const actionDeleteAccount = async (req: Request, res: Response) => {
  try {
    return await deleteAccount(
      { body: inputOf(req), user: { id: sessionUserId(req) } } as any,
      res
    );
  } catch (err) {
    const { status, body } = actionError(err);
    return res.status(status).json(body);
  }
};
