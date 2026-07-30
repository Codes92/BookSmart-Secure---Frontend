import { useState, useEffect, useRef } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { Lock } from "lucide-react";

import "../styles/component-styles/regular-header.css";

export default function RegularHeader()
{
    const {logout} = useAuth();
    const navigate = useNavigate();
    const navRef = useRef(null);
    // Hamburger menu on small screens
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const closeMenu = () => setMenuOpen(false);

    // Code to close the menu when user clicks outside or away from it
    useEffect(() => {
        // Helper function to run whenever user clicks
        const handleClickOutside = (e) => {
            // a) is the menu there, and b) did the person click inside the menu?
            if (navRef.current && !navRef.current.contains(e.target))
            {
                // Close the menu
                setMenuOpen(false);
            }
        };
        // Listen for mouse click anywhere on the page, and run the helper function
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup to prevent computer listening after
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="app-regular-navbar">

            <div className="regular-navbar-left">
                <NavLink to="/dashboard" className="logo-link">
                    <h1>BookSmart</h1>
                    <div className="auth-subheading-container">
                        <Lock size={16}/>
                        <h3 className="auth-page-subtitle">Secure</h3>
                    </div>
                </NavLink>
            </div>

            <button className="hamburger"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle Menu"
                aria-expanded={menuOpen}
            >
                ☰
            </button>

            <div className={`regular-navbar-right ${menuOpen ? 'mobile-open' : ''}`}>
                <NavLink to="/dashboard" className="regular-nav-link" onClick={closeMenu}>Dashboard</NavLink>
                <NavLink to="/library" className="regular-nav-link" onClick={closeMenu}>Library</NavLink>
                <NavLink to="/profile" className="regular-nav-link" onClick={closeMenu}>Profile</NavLink>
                <NavLink to="/goals" className="regular-nav-link" onClick={closeMenu}>Goals</NavLink>
                <NavLink to="/recommendations" className="regular-nav-link" onClick={closeMenu}>Recommendations</NavLink>
                <NavLink to="/add-book" className="regular-nav-link" onClick={closeMenu}>Search</NavLink>
                <button className="regular-logout-button" onClick={handleLogout}>Logout</button>
            </div>

        </div>
    );
}