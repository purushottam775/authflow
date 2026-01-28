import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            logout();
            toast.success("Logged out successfully");
            navigate("/");
        } catch {
            logout();
            navigate("/");
        }
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">⚡</span>
                    <span className="logo-text">AuthFlow</span>
                </Link>

                <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Dashboard
                            </Link>
                            <div className="nav-user">
                                <User size={18} />
                                <span>{user?.name}</span>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setIsMenuOpen(false)}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
