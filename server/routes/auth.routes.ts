import { Router } from "express";
import {
    signup,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.ts";

const router = Router();

// 🔐 Auth Routes
router.post("/signup", signup);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
