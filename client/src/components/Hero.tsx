import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import "./Hero.css";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg">
                <div className="hero-gradient"></div>
                <div className="hero-grid"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span>Trusted by 10,000+ developers</span>
                </div>

                <h1 className="hero-title">
                    Secure Authentication
                    <span className="gradient-text"> Made Simple</span>
                </h1>

                <p className="hero-subtitle">
                    Build faster with our modern authentication solution.
                    Email verification, password reset, and secure sessions — all out of the box.
                </p>

                <div className="hero-cta">
                    <Link to="/signup" className="btn btn-primary btn-lg">
                        Get Started Free
                        <ArrowRight size={20} />
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                        Sign In
                    </Link>
                </div>

                <div className="hero-features">
                    <div className="hero-feature">
                        <Shield className="feature-icon" size={20} />
                        <span>Secure by default</span>
                    </div>
                    <div className="hero-feature">
                        <Zap className="feature-icon" size={20} />
                        <span>Lightning fast</span>
                    </div>
                    <div className="hero-feature">
                        <Lock className="feature-icon" size={20} />
                        <span>JWT tokens</span>
                    </div>
                </div>
            </div>

            <div className="hero-glow"></div>
        </section>
    );
}
