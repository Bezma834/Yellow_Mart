import { Router } from "express";
import {
  actionLogin,
  actionGoogle,
  actionSignup,
  actionCheckEmail,
  actionForgotPassword,
  actionResetPassword,
  actionChangePassword,
  actionDeleteAccount
} from "../controllers/actionController";

const router = Router();

router.post("/login", actionLogin);
router.post("/google", actionGoogle);
router.post("/signup", actionSignup);
router.post("/checkEmail", actionCheckEmail);
router.post("/forgotPassword", actionForgotPassword);
router.post("/resetPassword", actionResetPassword);
router.post("/changePassword", actionChangePassword);
router.post("/deleteAccount", actionDeleteAccount);

export default router;
