import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">⚡</span>
                            <span className="logo-text">AuthFlow</span>
                        </Link>
                        <p className="footer-tagline">
                            Secure authentication made simple. Build faster with modern auth solutions.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <Link to="/">Features</Link>
                            <Link to="/">Pricing</Link>
                            <Link to="/">Documentation</Link>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <Link to="/">About</Link>
                            <Link to="/">Blog</Link>
                            <Link to="/">Careers</Link>
                        </div>
                        <div className="footer-column">
                            <h4>Support</h4>
                            <Link to="/">Help Center</Link>
                            <Link to="/">Contact</Link>
                            <Link to="/">Privacy Policy</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AuthFlow. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
