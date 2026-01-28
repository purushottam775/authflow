import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            await authAPI.signup({ name, email, password });
            setIsSuccess(true);
            toast.success("Account created! Check your email to verify.");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Signup failed");
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
                        <h2>Check Your Email</h2>
                        <p>
                            We've sent a verification link to <strong>{email}</strong>.
                            Click the link to verify your account.
                        </p>
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
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join us and start building today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                className="form-input with-icon"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

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

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input with-icon"
                                placeholder="Create a password (min. 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
