import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard auth-page-wrapper">
            <div className="dashboard-simple">
                <div className="welcome-card">
                    <div className="welcome-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="welcome-title">Welcome to Dashboard</h1>
                    <p className="welcome-name">{user?.name}</p>
                    <p className="welcome-email">{user?.email}</p>

                    <button className="btn btn-secondary logout-btn" onClick={logout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <footer className="dashboard-footer">
                    <p>Created by <span className="creator-name">Purushottam Patil</span></p>
                </footer>
            </div>
        </div>
    );
}
