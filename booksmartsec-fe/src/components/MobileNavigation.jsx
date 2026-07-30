import { NavLink } from "react-router-dom";
import { User, LibraryBig, Sparkles, LayoutDashboard, TrendingUp } from "lucide-react";

import "../styles/component-styles/mobile-navigation.css";

export default function MobileNavigation()
{
    return (
        <div className="mobile-navbar-container">
            <div className="mobile-navbar">
                <div className="mobile-link-container">
                    <NavLink to="/dashboard" className="mobile-nav-link">
                        <LayoutDashboard className="mobile-link-icon" />
                        Dashb'd
                    </NavLink>
                </div>

                <div className="mobile-link-container">
                    <NavLink to="/library" className="mobile-nav-link">
                        <LibraryBig className="mobile-link-icon" />
                        Library
                    </NavLink>
                </div>

                <div></div>

                <div className="mobile-link-container">
                    <NavLink to="/goals" className="mobile-nav-link">
                        <TrendingUp className="mobile-link-icon" />
                        Goals
                    </NavLink>
                </div>

                <div className="mobile-link-container">
                    <NavLink to="/profile" className="mobile-nav-link">
                        <User className="mobile-link-icon" />
                        Profile
                    </NavLink>
                </div>

                <div className="mobile-recommendation-link-container">
                    <NavLink to="/recommendations" className="mobile-nav-link">
                        <Sparkles className="mobile-link-icon" />
                        AI Recom
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

/**
 * <div className="mobile-navbar">
                <div className="mobile-link-container">
                    <NavLink to="/add-book" className="mobile-nav-link"><Search className="mobile-link-icon" />Search</NavLink>
                </div>
                <div className="mobile-link-container">
                    <NavLink to="/library" className="mobile-nav-link"><LibraryBig className="mobile-link-icon" />Library</NavLink>
                </div>
                <div className="mobile-nav-spacer"></div>
                <div className="mobile-recommendation-link-container">
                    <NavLink to="/recommendations" className="mobile-nav-link"><Sparkles className="mobile-link-icon" />AI Recom</NavLink>
                </div>
                <div className="mobile-nav-spacer"></div>
                <div className="mobile-link-container">
                    <NavLink to="/goals" className="mobile-nav-link"><TrendingUp className="mobile-link-icon" />Goals</NavLink>
                </div>
                <div className="mobile-link-container">
                    <NavLink to="/profile" className="mobile-nav-link"><User className="mobile-link-icon"/>Profile</NavLink>
                </div>
            </div>
 */