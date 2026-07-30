/**
 * Frontend page for Registration
 * Required:
 *      - useState - form field + error/loading state
 *      - useNavigate - for redirecting after registration
 *      - useAuth - access register function
 */

import { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { stripHtml } from "../utils/sanitise";

import BasicFooter from "../components/BasicFooter";

import "../styles/page-styles/auth.css";
import { Lock, Eye, EyeOff, Loader } from "lucide-react";
import PasswordStrength from "../components/PasswordStrength";

/* Define Register page */
export default function Register()
{
    // Request register function from AuthContext
    const {register} = useAuth();

    // Show message when registration fails
    const [error, setError] = useState("");
    // Disable buttons and show spinner during API call
    const [loading, setLoading] = useState(false);

    // Enables user to be re-routed after registration success
    const navigate = useNavigate();

    // Store email input
    const [email, setEmail] = useState("");
    // Store username input
    const [username, setUsername] = useState("");
    // Store password
    const [password, setPassword] = useState("");

    // Store show password
    const [showPassword, setShowPassword] = useState(false);

    // Logic to process registration data to backend through AuthContext/API
    const handleSubmit = async (e) => {
        
        e.preventDefault();

        // Quick validation prior to API call
        if (!email || !username || !password)
        {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError("");

        try
        {
            await register(email, stripHtml(username), password);
            navigate('/library');
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-content">
                <div className="auth-header">
                    <div className="auth-booksmart-title">
                        <h1 className="auth-page-title">BookSmart</h1>
                        <div className="auth-subheading-container">
                            <Lock size={16}/>
                            <h3 className="auth-page-subtitle">Secure</h3>
                        </div>
                    </div>
                    <p className="auth-slogan">Track Your Reading Journey</p>
                </div>
                <div className="auth-form">
                    <h2 className="auth-title">Register</h2>

                    <p className="error">{error}</p>

                    <form onSubmit={handleSubmit}>
                        <input className="text-input-field"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />

                        <input className="text-input-field"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />

                        <div className="password-input-container">
                            <input className="text-input-field"
                                type={showPassword ? "text": "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            {showPassword ? <EyeOff className="show-password-icon" onClick={() => setShowPassword(false)}/> : <Eye className="show-password-icon" onClick={() => setShowPassword(true)}/>}
                        </div>
                        
                        {password && <PasswordStrength password={password}/>}

                        <button className="auth-submit-button" type="submit" disabled={loading}>
                            {loading ? <Loader className="submit-loader-icon" /> : "Register"}
                        </button>
                    </form>
                    <div className="sign-up-container">
                        <p className="sign-up">Already have an account?</p>
                        <Link className="login-link" to="/login">Login</Link>
                    </div>
                </div>
            </div>
            <BasicFooter />
        </div>
    );
}