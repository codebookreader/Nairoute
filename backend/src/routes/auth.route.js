import { Router } from "express";
import { syncUser } from "../controllers/auth.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/sync",verifyFirebaseToken,syncUser);

export default router;