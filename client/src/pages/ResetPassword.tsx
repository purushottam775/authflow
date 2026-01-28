import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, KeyRound } from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import "./Auth.css";

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !otp || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            await authAPI.resetPassword({ email, otp, newPassword });
            setIsSuccess(true);
            toast.success("Password reset successful!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="auth-container auth-page-wrapper">
                <div className="auth-card animate-slide-up">
                    <div className="auth-success">
                        <div className="auth-success-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h2>Password Reset!</h2>
                        <p>Your password has been successfully reset. You can now login with your new password.</p>
                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container auth-page-wrapper">
            <div className="auth-card animate-slide-up">
                <div className="auth-header">
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">Enter the OTP sent to your email and create a new password</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!location.state?.email && (
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">OTP Code</label>
                        <div className="input-wrapper">
                            <KeyRound className="input-icon" size={18} />
                            <input
                                type="text"
                                className="form-input with-icon"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input with-icon"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="input-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input with-icon"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Remember your password? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
