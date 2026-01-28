import Hero from "../components/Hero";
import { Shield, Zap, Lock, Mail, Key, CheckCircle } from "lucide-react";
import "./Home.css";

const features = [
    {
        icon: Shield,
        title: "Secure by Design",
        description: "Built with security best practices. JWT tokens, password hashing, and secure sessions.",
    },
    {
        icon: Mail,
        title: "Email Verification",
        description: "Automatic email verification with customizable templates using Resend.",
    },
    {
        icon: Key,
        title: "Password Reset",
        description: "Secure OTP-based password reset flow with expiration.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized API responses with efficient database queries.",
    },
    {
        icon: Lock,
        title: "Protected Routes",
        description: "Easy-to-implement route protection for authenticated users.",
    },
    {
        icon: CheckCircle,
        title: "Production Ready",
        description: "Tested, documented, and ready for deployment.",
    },
];

export default function Home() {
    return (
        <main className="home">
            <Hero />

            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Everything You Need</h2>
                        <p className="section-subtitle">
                            A complete authentication solution for modern applications
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-card-icon">
                                    <feature.icon size={24} />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Get Started?</h2>
                        <p>Create your account and start building today.</p>
                        <a href="/signup" className="btn btn-primary btn-lg">
                            Create Free Account
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
