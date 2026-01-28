import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,

        isVerified: { type: Boolean, default: false },
        emailVerifyToken: String,

        resetOTP: String,
        resetOTPExpiry: Date,
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
