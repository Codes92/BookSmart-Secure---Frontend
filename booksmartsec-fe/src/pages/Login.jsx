/**
 * Frontend page for Login
 * Required:
 *      - useState - form field + error/loading state
 *      - useNavigate - for redirecting after login
 *      - useAuth - access login function
 */

import { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import BasicFooter from "../components/BasicFooter";

import "../styles/page-styles/auth.css";
import { Lock, Eye, EyeOff, Loader } from "lucide-react";

/* Define Login page */
export default function Login()
{
    // Request register function from AuthContext
    const {login} = useAuth();

    // Show message when login fails
    const [error, setError] = useState("");
    // Disable buttons and show spinner during API call
    const [loading, setLoading] = useState(false);

    // Enables user to be re-routed after login success
    const navigate = useNavigate();

    /* FOR NOW, logging in with username is unavailable */
    // Store email input
    const [email, setEmail] = useState("");
    // Store password
    const [password, setPassword] = useState("");

    // Store show password
    const [showPassword, setShowPassword] = useState(false);

    // Logic to process login data to backend through AuthContext/API
    const handleSubmit = async (e) => {
        
        e.preventDefault();

        // Quick validation prior to API call
        if (!email || !password)
        {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError("");

        try
        {
            await login(email, password);
            navigate('/dashboard');
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
                    <h2 className="auth-title">Login</h2>

                    <p className="error">{error}</p>

                    <form onSubmit={handleSubmit}>
                        <input className="text-input-field"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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

                        <button className="auth-submit-button" type="submit" disabled={loading}>
                            {loading ? <Loader className="submit-loader-icon" /> : "Login"}
                        </button>
                    </form>
                   <div className="sign-up-container">
                        <p className="sign-up">Don't have an account?</p>
                        <Link className="login-link" to="/register">Register</Link>
                    </div>
                </div>
            </div>
            <BasicFooter />
        </div>
    );
}