import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";
import { generateOTP } from "../utils/otp";

/* =========================
   SIGN UP (REGISTER)
========================= */
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomBytes(32).toString("hex");

        await User.create({
            name,
            email,
            password: hashedPassword,
            emailVerifyToken: verifyToken,
            isVerified: false,
        });

        // Fallback to production URL if CLIENT_URL is not set
        const PRODUCTION_URL = "https://authflow-wine.vercel.app";
        const clientUrl = process.env.CLIENT_URL || PRODUCTION_URL;

        console.log("[DEBUG] CLIENT_URL from env:", process.env.CLIENT_URL);
        console.log("[DEBUG] Using clientUrl:", clientUrl);

        const verifyLink = `${clientUrl}/verify/${verifyToken}`;

        await sendEmail(
            email,
            "Verify your account",
            `<h3>Email Verification</h3>
       <p>Click the link below to verify your email:</p>
       <a href="${verifyLink}">${verifyLink}</a>`
        );

        res.status(201).json({
            message: "Signup successful. Verification email sent.",
        });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error });
    }
};

/* =========================
   VERIFY EMAIL
========================= */
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ emailVerifyToken: token });
        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });

        user.isVerified = true;
        user.emailVerifyToken = undefined;
        await user.save();

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Email verification failed" });
    }
};

/* =========================
   LOGIN
========================= */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        if (!user.isVerified)
            return res.status(401).json({ message: "Please verify your email" });

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user._id.toString());

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

/* =========================
   LOGOUT
========================= */
export const logout = async (_req: Request, res: Response) => {
    // JWT is stateless → logout handled on client
    res.json({ message: "Logged out successfully" });
};

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const otp = generateOTP();

        user.resetOTP = otp;
        user.resetOTPExpiry = new Date(
            Date.now() + Number(process.env.OTP_EXPIRE_MINUTES) * 60 * 1000
        );

        await user.save();

        await sendEmail(
            email,
            "Password Reset OTP",
            `<h3>Password Reset</h3>
       <p>Your OTP is: <b>${otp}</b></p>
       <p>This OTP will expire in ${process.env.OTP_EXPIRE_MINUTES} minutes.</p>`
        );

        res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

/* =========================
   VERIFY OTP & RESET PASSWORD
========================= */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetOTP: otp,
            resetOTPExpiry: { $gt: new Date() },
        });

        if (!user)
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Password reset failed" });
    }
};
