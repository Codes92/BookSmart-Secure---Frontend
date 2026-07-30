/**
 * @description Profile card component used when a user has completed a profile
 */

import { READING_LENGTH, READING_PACE } from "../constants/preferences";

import "../styles/component-styles/preferences.css";

export default function PreferencesCard({preferences})
{

    const readingLength = READING_LENGTH.find(l => l.value === preferences.preferred_length)?.label || preferences.preferred_length;
    const readingPace = READING_PACE.find(p => p.value === preferences.reading_pace)?.label || preferences.reading_pace;

    return (
        <div className="preferences-card">
            <div className="reading-length-container">
                <p className="profile-card-label">Material Length: </p>
                <span className={`badge badge-${preferences.preferred_length.toLowerCase()}`}>
                    {readingLength}
                </span>
            </div>
            <div className="reading-pace-container">
                <p className="profile-card-label">Reading Pace: </p>
                <span className={`badge badge-${preferences.reading_pace.toLowerCase()}`}>
                    {readingPace}
                </span>
            </div>
        </div>
    );
}
/**
     * <p className="preference-detail">Material length: <span className="preference-metric">{preferences?.preferred_length || "Not specified"}</span></p>
            <p className="preference-detail">Reading pace: <span className="preference-metric">{preferences?.reading_pace || "Not specified"}</span></p>
     */