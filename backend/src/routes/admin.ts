import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import {
  getStats,
  getBusinesses,
  approveBusiness,
  rejectBusiness,
  deleteBusiness,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  updateUserRole,
  deleteUser
} from "../controllers/adminController";

const router = Router();

router.use(adminAuth);

// Dashboard
router.get("/stats", getStats);

// Businesses
router.get("/businesses", getBusinesses);
router.patch("/businesses/:id/approve", approveBusiness);
router.patch("/businesses/:id/reject", rejectBusiness);
router.delete("/businesses/:id", deleteBusiness);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Users
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
