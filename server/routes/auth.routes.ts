import { Router } from "express";
import {
    signup,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    debugEnv
} from "../controllers/auth.controller";

const router = Router();

// 🔐 Auth Routes
router.get("/debug-env", debugEnv);
router.post("/signup", signup);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
