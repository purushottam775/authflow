import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { authAPI } from "../services/api";
import "./Auth.css";

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyToken = async () => {
            // Prevent double execution in React Strict Mode
            if (hasVerified.current) return;
            hasVerified.current = true;

            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link");
                return;
            }

            try {
                const response = await authAPI.verifyEmail(token);
                setStatus("success");
                setMessage(response.data.message || "Email verified successfully!");
            } catch (error: unknown) {
                setStatus("error");
                const err = error as { response?: { data?: { message?: string } } };
                setMessage(err.response?.data?.message || "Verification failed");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="auth-container auth-page-wrapper">
            <div className="auth-card animate-slide-up">
                {status === "loading" && (
                    <div className="auth-success">
                        <div className="auth-success-icon" style={{ borderColor: "var(--primary)", background: "rgba(99, 102, 241, 0.1)" }}>
                            <Loader size={40} className="spinner" style={{ color: "var(--primary)" }} />
                        </div>
                        <h2>Verifying Email...</h2>
                        <p>Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="auth-success">
                        <div className="auth-success-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h2>Email Verified!</h2>
                        <p>{message}</p>
                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="auth-success">
                        <div className="auth-success-icon" style={{ borderColor: "var(--error)", background: "rgba(239, 68, 68, 0.1)" }}>
                            <XCircle size={40} style={{ color: "var(--error)" }} />
                        </div>
                        <h2>Verification Failed</h2>
                        <p>{message}</p>
                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={() => navigate("/signup")}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
