import { Router } from "express";
import { syncUser,updateProfile } from "../controllers/auth.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/sync",verifyFirebaseToken,syncUser);
router.post("/update",verifyFirebaseToken,updateProfile);

export default router;