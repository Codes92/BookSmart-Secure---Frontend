import { useNavigate } from "react-router-dom";

import "../styles/page-styles/privacy-policy.css";

export default function PrivacyPolicy()
{
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="page-content privacy-policy-page">
                <div className="page-heading">
                    <h1 className="page-title">Our Privacy Policy</h1>
                </div>
                
                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">Application</h2>
                    <p className="privacy-policy-section-subheading">BookSmart Secure was created as a portfolio project to test the skills of the developer. It is completely free to use and no money or subscription is required for access.</p>
                    <ul className="privacy-policy-list">
                        <li>Application Name: <span className="span-bold">BookSmart Secure</span></li>
                        <li>Developer Name: <span className="span-bold">Lawrence Freeman</span></li>
                        <li>Developer Email Address: <span className="span-bold">ACodes90@gmail.com</span></li>
                        <li>Application Last Updated: <span className="span-bold">07/27/2026</span></li>
                    </ul>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">Data Collection</h2>
                    <p className="privacy-policy-section-subheading">We collect the following information from users who register an account with us:</p>
                    <ul className="privacy-policy-list">
                        <li>Email Address</li>
                        <li>Username (created by user)</li>
                        <li>Age, country, occupation, biography (all optional)</li>
                        <li>Reading History - books added, reading status, current progress, ratings</li>
                        <li>Reading goals</li>
                        <li>Reading preferences - speed/pace and length</li>
                    </ul>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">How We Use Your Data</h2>
                    <div className="privacy-policy-text-block">
                        <p>The data we collect from you helps provide the app's functionality. When you create a new reading goal for example, this information enters our database and is safely stored so you can view it whenever you
                            log in to your account. It stays in our database until you delete it from the app at any time you wish, at which point it is permanently deleted. The profile, library and recommendations functions work exactly the same way.
                        </p>
                        <p>User data helps us to provide you with recommendations tailored to your reading history and the books you enjoy reading. By providing us with information such as your reading preferences and occupation, our AI
                            functionality can identify books suited to you.
                        </p>
                        <p>
                            If you simply want to search for books and keep track of those you've read without using the AI feature, you have no obligation to provide us with any personal information other than an email address, account username
                            and account password. If you decide to stop using our service, you can delete your account at any time and your email address, username and password, profile and account-linked data will be permanently deleted from our database.
                        </p>
                    </div>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">Use of Third Party Services</h2>
                    <div className="privacy-policy-text-block">
                        <div className="third-party-information-container">
                            <p>To ensure users have search access to the largest variety of books available, we use Google Books API for our book search functionality. Google provides this service publicly.</p>
                            <a className="third-party-link" href="https://developers.google.com/books/terms" target="_blank" rel="noopener noreferrer">Google Books API Terms of Use</a>
                            <a className="third-party-link" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                            <p>By using our search books feature, you are also subject to Google's Terms of Service</p>
                        </div>
                        <div className="third-party-information-container">
                            <p>Our recommendations service uses Anthropic's Claude API. As AI continues to evolve, we may be required to change our model. This privacy policy will be updated to reflect any changes.</p>
                            <a className="third-party-link" href="https://anthropic.com/terms" target="_blank" rel="noopener noreferrer">Anthropic API Terms of Use</a>
                            <a className="third-party-link" href="https://anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Anthropic Privacy Policy</a>
                            <p>By using our recommendations feature, you are also subject to Anthropic's Terms of Service</p>
                        </div>
                    </div>
                    <p className="third-party-disclaimer">BookSmart Secure does not control how third parties handle data. For more information, please refer to the links provided in this section.</p>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">How We Store Your Data</h2>
                    <p>When you create an account with us, your email, username and password are stored in our database. Your password is hashed using Argon2 before it is stored in our database.</p>
                    <p>Your data is <span className="span-bold">NOT</span> sold to third parties under any circumstances.</p>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">Data Retention</h2>
                    <p>Your data is stored <span className="span-bold">ONLY</span> while your account is active. If you choose to delete your account, all data linked to your account will be permanently deleted from our database and unrecoverable.</p>
                    <p>While your account is active, you can choose to delete any profile, books, goals and recommendations linked to your account by using the available app functions.</p>
                    <p>Creating a profile is totally optional. If you choose to create a profile, deleting it will not affect your account status. Deleting your profile will permanently delete your profile data from our database
                        and it will become unrecoverable thereafter.
                    </p>
                    <p>Books you have inserted into your library or been recommended will go into a global app library in our database, but this serves only to make the app performance more efficient, and books in this library
                        contain no links to individual users.
                    </p>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">Accessing Your Data</h2>
                    <p>You retain all rights to your data and are free to delete your account, profile, reading history, recommendations and goals at any time.</p>
                    <p>You may use the Developer Email Address provided to contact us at any time.</p>
                    <p>Under the GDPR, you have the right to access, rectify and delete your data. BookSmart Secure strives to meet all obligations of data privacy regulations</p>
                    <p>If a data breach occurs that affects user data, affected users will be notified as quickly as reasonably possible, and we will take immediate steps to secure affected systems and determine the cause of the breach.</p>
                </div>

                <div className="grey-divider"></div>

                <div className="privacy-policy-section">
                    <h2 className="privacy-policy-section-title">Children's Privacy</h2>
                    <p>This application is not directed at Children under 13 years of age.</p>
                </div>

                <div className="security-page-button-container">
                    <button className="primary-button go-to-button" onClick={() => navigate(-1)}>
                        Return
                    </button>
                </div>
            </div>
        </div>
    )
}