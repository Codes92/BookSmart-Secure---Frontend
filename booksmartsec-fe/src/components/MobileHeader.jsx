/**
 * This component comprised the top of mobile screens on regular pages. It is not used for navigation,
 * rather it is used as extra help
 */

import { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import {FileQuestion, Lock, LogOut, Search } from "lucide-react";

import "../styles/component-styles/mobile-header.css";

export default function MobileHeader()
{

    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const [helpButton, setHelpButton] = useState(false);

    const handleHelpRequest = () => {
        setHelpButton(true);
    }

    return (
        <div className="mobile-header-wrapper">
            <div className="mobile-header-left">
                <h3 className="mobile-header-heading">BookSmart</h3>
                <div className="mobile-header-subheading-container">
                    <Lock size="var(--font-size-md)"/>
                    <h4 className="mobile-header-subheading">Secure</h4>
                </div>
            </div>
            <div className="mobile-header-right">
                <NavLink to="/add-book" className="mobile-header-icon">
                    <Search className="mobile-link-icon"/>
                </NavLink>
                <FileQuestion className="help-button" color="var(--primary)" fill="var(--white)" size={26} onClick={() => handleHelpRequest()}/>
                <LogOut className="mobile-logout-button" color="var(--white)" onClick={handleLogout} />
            </div>

            {helpButton && 
                <div className="modal-overlay">
                    <div className="modal help-modal">
                        <div className="help-intro">
                            <h4 className="help-title">
                                BookSmart Secure is your personal reading tracker, powered by AI recommendations
                            </h4>
                        </div>

                        <div className="help-individual-sections">
                            <div className="help-section">
                                <h4 className="help-section-title">Library</h4>
                                <p className="help-description">
                                    Search and add books, track your reading progress and rate finished books
                                </p>
                            </div>
                            <div className="help-section">
                                <h4 className="help-section-title">Goals</h4>
                                <p className="help-description">
                                    Set weekly, monthly or yearly reading targets and track your progress
                                </p>
                            </div>
                            <div className="help-section">
                                <h4 className="help-section-title">Recommendations</h4>
                                <p className="help-description">
                                   Get AI-powered book suggestions based on your reading history
                                </p>
                            </div>
                            <div className="help-section">
                                <h4 className="help-section-title">Profile</h4>
                                <p className="help-description">
                                    Store your basic personal information and reading preferences
                                </p>
                                <p className="help-description">
                                    Delete your profile or account
                                </p>
                            </div>
                        </div>

                        <div className="help-tips-container">
                            <h4 className="help-tips-title">Tips:</h4>
                            <ul>
                                <li>Generate a recommendation the from Recommendations page</li>
                                <li>Update your reading progress from the Library page</li>
                                <li>Your preferences help improve your recommendations</li>
                            </ul>
                        </div>


                        <button className="modal-cancel primary-button view-details-button" onClick={() => setHelpButton(false)}>
                            Go back
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}