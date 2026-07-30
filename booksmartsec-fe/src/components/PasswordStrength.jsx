import { passwordStrengthCheck } from "../utils/passwordStrength";

import "../styles/component-styles/password-strength.css";

export default function PasswordStrength({ password })
{
    // Call password strength function on password for object
    const score = passwordStrengthCheck(password);

    return (
        <div className="password-strength-container">
            <div className="password-strength-bar">
                <div className="password-variable-bar" style={{width: `${(score.score + 1) * 20}%`, backgroundColor: score.colour}}>
                </div>
            </div>
            <p className="password-strength-message">{score.readable}</p>
        </div>
    );
}