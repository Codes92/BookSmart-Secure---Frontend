import { Link as RouterLink } from "react-router-dom";

import "../styles/component-styles/footer.css";

export default function Footer()
{
    return (
        <footer className="footer-wrapper">
            <div className="footer-inner">
                <div className="footer-left">
                    <p className="footer-policy-link">Track your reading journey</p>
                    <p className="footer-copyright">© 2026 BookSmart. All rights reserved.</p>
                </div>

                <div className="footer-right">
                    <a className="footer-link" href="https://github.com/Codes92/BookSmart-Secure---Backend/tree/master" target="_blank" rel="noopener noreferrer">Github</a>
                    <RouterLink className="footer-link" to="/privacy-policy">Privacy Policy</RouterLink>
                </div>
            </div>
        </footer>
    );
}