import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  signup,
  login,
  googleLogin,
  checkEmail,
  forgotPassword,
  resetPassword,
  changePassword
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/check-email", checkEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/change-password", authMiddleware, changePassword);

export default router;
