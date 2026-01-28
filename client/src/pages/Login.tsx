import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data;

            login(user, token);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-slide-up">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your account to continue</p>
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

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input with-icon"
                                placeholder="Enter your password"
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

                    <div className="form-group">
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
