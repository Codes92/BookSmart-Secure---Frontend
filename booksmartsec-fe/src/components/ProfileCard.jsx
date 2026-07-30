/**
 * @description Profile card component used when a user has completed a profile
 */

import { Briefcase, Cake, Flag } from "lucide-react";

import PreferencesCard from "./PreferencesCard";

import "../styles/component-styles/profile-card.css";

export default function ProfileCard({profile, preferences, onEdit, onDelete})
{
    return (
        <div className="profile-card">

            <div className="username-container">
                
                <div className="username-avatar-container">
                    <div className="username-initial-container">
                        <h3>{profile.username[0].toUpperCase()}</h3>
                    </div>
                    <p className="profile-detail"><span className="profile-metric">{profile.username}</span></p>
                </div>
                <div className="books-read-container">
                    <span className="books-read-metric">{profile.books_read}</span>
                    <p className="profile-metric">Books Read</p>
                </div>
            </div>

            <div className="biography-container">
                <p className="profile-detail">{profile.biography || "Tell us more about you"}</p>
            </div>

            <div className="personal-information-container">
                <div className="profile-detail">
                    <div className="profile-detail-upper">
                        <Cake color="var(--primary)"/>
                    </div>
                    <div className="profile-detail-lower">
                        <span className="profile-metric">{profile.age || "Not specified"}</span>
                    </div>
                </div>

                <div className="vertical-divider"></div>
                
                <div className="profile-detail">
                    <div className="profile-detail-upper">
                        <Flag color="var(--primary)"/>
                    </div>
                    <div className="profile-detail-lower">
                        <span className="profile-metric">{profile.country || "Not specified"}</span>
                    </div>
                </div>

                <div className="vertical-divider"></div>

                <div className="profile-detail">
                    <div className="profile-detail-upper">
                        <Briefcase color="var(--primary)"/>
                    </div>
                    <div className="profile-detail-lower">
                        <span className="profile-metric">{profile.occupation || "Not specified"}</span>
                    </div>
                </div>
            </div>
            
            <div className="profile-preferences-container">
                <PreferencesCard preferences={preferences}/>
            </div>

            <div className="profile-card-button-container">
                <button className="profile-edit-button" onClick={onEdit}>Edit Profile</button>
                <button className="profile-delete-button" onClick={onDelete}>Delete Profile</button>
            </div>
        </div>
    );
}