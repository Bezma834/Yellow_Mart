import { Router } from "express"
import { authMiddleware } from "../middleware/auth"
import { test, deleteAccount } from "../controllers/userController"


const router = Router()



router.get("/test", test)



// DELETE ACCOUNT
// JWT required; password confirms the deletion is deliberate.
// Google-only users (no stored password) skip the password check.
router.post(
"/delete-account",
authMiddleware,
deleteAccount
)



export default router
