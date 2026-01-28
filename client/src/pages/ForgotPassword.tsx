import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import "./Auth.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setIsSuccess(true);
            toast.success("OTP sent to your email!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to send OTP");
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
                        <h2>OTP Sent!</h2>
                        <p>
                            We've sent a 6-digit OTP to <strong>{email}</strong>.
                            Use it to reset your password.
                        </p>
                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={() => navigate("/reset-password", { state: { email } })}
                        >
                            Enter OTP
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
                    <h1 className="auth-title">Forgot Password?</h1>
                    <p className="auth-subtitle">
                        Enter your email and we'll send you an OTP to reset your password
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                className="form-input with-icon"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Sending OTP...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    <Link to="/login" className="back-link">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
