import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { test, deleteAccount } from "../controllers/userController";

const router = Router();

router.get("/test", test);
router.post("/delete-account", authMiddleware, deleteAccount);

export default router;
