/**
 * Frontend page for Profile
 * Required:
 *      - useState - form field + error/loading state
 *      - useNavigate - for redirecting after deletion of profile
 *      - useAuth - profile functions require login
 *      - useEffect - fetch profile upon page load
 *      (From api.js)
 *      - getUserProfile
 *      - createUserProfile
 *      - updateUserProfile
 *      - deleteUserProfile
 */

import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile, userDelete, changeUserPassword } from "../services/api";
import { createUserPreferences, getUserPreferences, updateUserPreferences, deleteUserPreferences } from "../services/api";
import { countries } from "countries-list";
import { Loader, Eye, EyeOff } from "lucide-react";

import RegularHeader from "../components/RegularHeader";
import MobileHeader from "../components/MobileHeader";
import MobileNavigation from "../components/MobileNavigation";
import ProfileCard from "../components/ProfileCard";
import Footer from "../components/RegularFooter";

import { stripHtml } from "../utils/sanitise";
import PasswordStrength from "../components/PasswordStrength";

import "../styles/page-styles/profile.css";

export default function Profile()
{
    const {logout} = useAuth();
    // Enables user to be re-routed
    const navigate = useNavigate();

    // Request register function from AuthContext
    const {user, loading: isLoading} = useAuth();

    // Show message when registration fails
    const [error, setError] = useState("");
    // Disable buttons and show spinner during API call
    const [loading, setLoading] = useState(true);

    // Store profile object
    const [profile, setProfile] = useState(null);
    // Store preferences object
    const [preferences, setPreferences] = useState(null);

    /* Store create profile fields (when user initially creates profile) */
    // Store create user age
    const [createAge, setCreateAge] = useState("");
    // Store create user country
    const [createCountry, setCreateCountry] = useState("");
    // Store create user occupation
    const [createOccupation, setCreateOccupation] = useState("");
    // Store create user biography
    const [createBiography, setCreateBiography] = useState("");

    /* Store create preference fields */
    // Store create preferred reading length
    const [createPrefLength, setCreatePrefLength] = useState("");
    // Store create preferred reading pace
    const [createPrefPace, setCreatePrefPace] = useState("");

    // Store submit
    const [submitting, setSubmitting] = useState(false);

    /* Store edit fields */
    // Store edit user age
    const [editAge, setEditAge] = useState("");
    // Store edit user country
    const [editCountry, setEditCountry] = useState("");
    // Store edit user occupation
    const [editOccupation, setEditOccupation] = useState("");
    // Store edit user biography
    const [editBiography, setEditBiography] = useState("");

    /* Store edit preference fields */
    // Store edit preferred reading length
    const [editPrefLength, setEditPrefLength] = useState("");
    // Store edit preferred reading pace
    const [editPrefPace, setEditPrefPace] = useState("");

    // Store delete profile modal
    const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);

    // Store create mode
    const [createMode, setCreateMode] = useState(false);
    // Store edit mode
    const [editMode, setEditMode] = useState(false);

    // Show delete account modal
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

    // Show input section to confirm deletion intent
    const [deleteInput, setDeleteInput] = useState("");

    // Show change password modal
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    // Store current password
    const [currentPassword, setCurrentPassword] = useState("");
    // Store new password
    const [newPassword, setNewPassword] = useState("");
    // Store new password confirm
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    
    // Store show password
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    // Store show new password
    const [showNewPassword, setShowNewPassword] = useState(false);
    // Store show confirm password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Store password change success state
    const [passwordChanged, setPasswordChanged] = useState(false);

    /* Page Logic */
    useEffect (() => {
        if (user)
        {
            const fetchProfile = async () => {
                try
                {

                    const [profileData, preferencesData] = await Promise.all([
                        getUserProfile(),
                        getUserPreferences()
                    ]); 
                    setProfile(profileData.profile);
                    setPreferences(preferencesData.userPreferences);
                }
                catch (error)
                {
                    if (error.message !== "Failed to retrieve preferences")
                    {
                        setError(error.message);
                    }
                }
                finally 
                {
                    setLoading(false)
                }
            };
            fetchProfile();
        }
    }, [user]);

    // Logic to handle initial profile creation
    const handleCreateProfile = async () => {
        try
        {
            const profileData = {
                age: parseInt(createAge),
                country: createCountry,
                occupation: stripHtml(createOccupation.trim()),
                biography: stripHtml(createBiography.trim()),
            }

            await createUserProfile(profileData);
            const fetchNewProfile = await getUserProfile();
            setProfile(fetchNewProfile.profile);
            setCreateAge("");
            setCreateCountry("");
            setCreateOccupation("");
            setCreateBiography("");
            setCreateMode(false);
        }
        catch(error)
        {
            setError(error.message);
        }
    }

    // Logic to handle updating the profile
    const handleUpdateProfile = async () => {
        try
        {
            const profileData = {
                age: parseInt(editAge),
                country: editCountry,
                occupation: stripHtml(editOccupation.trim()),
                biography: stripHtml(editBiography.trim())
            }

            if (profileData.occupation.length > 100)
            {
                setError("Please make sure your occupation is no more than 100 characters");
                return;
            }

            if (profileData.biography.length > 5000)
            {
                setError("Please make sure your biography is no more than 5000 characters");
                return;
            }

            const preferencesData = {};
            if (editPrefLength !== undefined)
            {
                preferencesData.prefLength = editPrefLength || null;
            }
            if (editPrefPace !== undefined)
            {
                preferencesData.prefPace = editPrefPace || null;
            }
            
            if (Object.keys(preferencesData).length > 0)
            {
                if (preferences)
                {
                    await updateUserPreferences(preferencesData);
                }
                else
                {
                    await createUserPreferences(preferencesData);
                }
                
                const fetchUpdatedPreferences = await getUserPreferences();
                setPreferences(fetchUpdatedPreferences.userPreferences);
            }
            
            await updateUserProfile(profileData);
            const fetchUpdatedProfile = await getUserProfile();
            setProfile(fetchUpdatedProfile.profile);
            
            setEditAge("");
            setEditCountry("");
            setEditOccupation("");
            setEditBiography("");
            setEditPrefLength("");
            setEditPrefPace("");
            setEditMode(false);
        }
        catch (error)
        {
            setError(error.message);
        }
    }

    const handleDeleteRequest = () => {
        setShowDeleteProfileModal(true);
    }

    // Logic to delete profile
    const handleDeleteConfirm = async () => {
        try
        {
            await deleteUserProfile();
            try
            {
                await deleteUserPreferences();
            }
            catch
            {
                if (error.message !== "Failed to delete preferences")
                {
                    setError(error.message);
                }
            }
            setProfile(null);
            setPreferences(null);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setShowDeleteProfileModal(false);
        }
    }

    const handleDeleteCancel = () => {
        setShowDeleteProfileModal(false);
    };

    // Logic to create initial preferences
    const handleCreatePreferences = async (prefLength, prefPace) => {
        if (!prefLength && !prefPace)
        {
            return;
        }
        if (createPrefLength && !createPrefPace || !createPrefLength && createPrefPace)
        {
            return;
        }
        try
        {
            await createUserPreferences({prefLength, prefPace});
            setPreferences({
                preferred_length: prefLength,
                reading_pace: prefPace});
        }
        catch (error)
        {
            setError(error.message);
        }
    }

    const handleCreateProfileAndPreferences = async () => {
        setSubmitting(true);
        await handleCreateProfile();
        await handleCreatePreferences(createPrefLength, createPrefPace);
        setSubmitting(false);
    }

    const handleDeleteAccountRequest = () => {
        setShowDeleteAccountModal(true);
    }

    const handleDeleteAccount = async () => {
        try
        {
            await userDelete();
            logout();
            navigate('/register');
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setShowDeleteAccountModal(false);
        }
    }

    const handleChangePasswordRequest = async () => {
        setShowChangePasswordModal(true);
    }

    const handleChangePassword = async (currentPassword, newPassword) => {
        try
        {
            await changeUserPassword(currentPassword, newPassword);
            setPasswordChanged(true);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
        }
    }

    if (isLoading || loading)
    {
        return <div>Loading...</div>
    }

    if (!user)
    {
        return <div>Unable to connect to server. Please try again later.</div>;
    }

    return (
        <div className="page-wrapper">

            <RegularHeader />
            <MobileHeader />

            <div className="page-content">
                <div className="page-heading">
                    <h1 className="page-title">Your Profile</h1>
                    <p className="page-subheading">Safely store your personal information</p>
                </div>
                {!profile ? 
                    <div className="create-profile-card">
                        <h2 className="create-profile-title">Create your profile</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateProfileAndPreferences();}}>
                            <div className="profile-age-container">
                                <label className="profile-card-label">Age:</label>
                                <select 
                                    className="dropdown-input-field"
                                    value={createAge}
                                    onChange={(e) => setCreateAge(e.target.value)}>
                                    <option value="">Select age</option>
                                    {Array.from({length: 120}, (_, i) => i + 1).map(age => (
                                        <option key={age} value={age}>{age}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="profile-country-container">
                                <label className="profile-card-label">Country:</label>
                                <select 
                                    className="dropdown-input-field"
                                    value={createCountry}
                                    onChange={(e) => setCreateCountry(e.target.value)}>
                                    <option value="">Select country</option>
                                    {Object.entries(countries).map(([code, data]) => (
                                        <option key={code} value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="profile-occupation-container">
                                <label className="profile-card-label">Occupation:</label>
                                <input
                                    className="text-input-field-small" 
                                    type="text" 
                                    value={createOccupation}
                                    onChange={(e) => setCreateOccupation(e.target.value)}
                                    placeholder="Occupation"
                                />
                            </div>
                            
                            <div className="profile-biography-container">
                                <label className="profile-card-label">Biography:</label>
                                <textarea
                                    className="biography-input-field"
                                    value={createBiography}
                                    onChange={(e) => setCreateBiography(e.target.value)}
                                    placeholder="Write a short biography..."
                                >
                                </textarea>
                            </div>
                            

                            <div className="preferences-container">
                                <div className="reading-length-container">
                                    <label className="profile-card-label">Preferred Reading Length:</label>
                                    <select 
                                        className="dropdown-input-field"
                                        value={createPrefLength}
                                        onChange={(e) => setCreatePrefLength(e.target.value)}>
                                        <option value="">Select reading length</option>
                                        <option value="short">Short</option>
                                        <option value="medium">Medium</option>
                                        <option value="long">Long</option>
                                    </select>
                                </div>
                                
                                <div className="reading-pace-container">
                                    <label className="profile-card-label">Preferred Reading Pace:</label>
                                    <select 
                                        className="dropdown-input-field"
                                        value={createPrefPace}
                                        onChange={(e) => setCreatePrefPace(e.target.value)}>
                                        <option value="">Select pace</option>
                                        <option value="casual">Casual</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="avid">Avid</option>
                                    </select>
                                </div>
                            </div>

                            <button className="profile-submit-button" type="submit" disabled={loading}>
                                {submitting ? <Loader className="submit-loader-icon" /> : "Submit Profile"}
                            </button>
                        </form>
                    </div>
                : profile && editMode ? 
                    <div className="edit-profile-card">
                        <h2 className="edit-profile-title">Edit your profile</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                            <div className="profile-age-container">
                                <label className="profile-card-label">Age:</label>
                                <select 
                                    className="dropdown-input-field"
                                    value={editAge}
                                    onChange={(e) => setEditAge(e.target.value)}>
                                    <option value="">Select age</option>
                                    {Array.from({length: 120}, (_, i) => i + 1).map(age => (
                                        <option key={age} value={age}>{age}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="profile-country-container">
                                <label className="profile-card-label">Country:</label>
                                <select 
                                    className="dropdown-input-field"
                                    value={editCountry}
                                    onChange={(e) => setEditCountry(e.target.value)}>
                                    <option value="">Select country</option>
                                    {Object.entries(countries).map(([code, data]) => (
                                        <option key={code} value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="profile-occupation-container">
                                <label className="profile-card-label">Occupation:</label>
                                <input
                                    className="text-input-field-small" 
                                    type="text" 
                                    value={editOccupation}
                                    onChange={(e) => setEditOccupation(e.target.value)}
                                    placeholder="Edit occupation"
                                />
                            </div>
                            
                            <div className="profile-biography-container">
                                <label className="profile-card-label">Biography:</label>
                                <textarea
                                    className="biography-input-field"
                                    value={editBiography}
                                    onChange={(e) => setEditBiography(e.target.value)}
                                    placeholder="Edit your biography..."
                                >
                                </textarea>
                            </div>
                            
                            <div className="preferences-container">
                                <div className="reading-length-container">
                                    <label className="profile-card-label">Preferred Reading Length:</label>
                                    <select 
                                        className="dropdown-input-field"
                                        value={editPrefLength}
                                        onChange={(e) => setEditPrefLength(e.target.value)}>
                                        <option value="">Select reading length</option>
                                        <option value="short">Short</option>
                                        <option value="medium">Medium</option>
                                        <option value="long">Long</option>
                                    </select>
                                </div>
                                
                                <div className="reading-pace-container">
                                    <label className="profile-card-label">Preferred Reading Pace:</label>
                                    <select 
                                        className="dropdown-input-field"
                                        value={editPrefPace}
                                        onChange={(e) => setEditPrefPace(e.target.value)}>
                                        <option value="">Select pace</option>
                                        <option value="casual">Casual</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="avid">Avid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="edit-form-buttons">
                                <button className="edit-profile-cancel-button" type="button" onClick={() => setEditMode(false)}>Cancel Changes</button>
                                <button className="edit-profile-save-changes-button" type="submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                : <ProfileCard 
                        profile={profile}
                        preferences={preferences}
                        onEdit={() => {
                            setEditAge(profile.age);
                            setEditCountry(profile.country);
                            setEditOccupation(profile.occupation);
                            setEditBiography(profile.biography);

                            setEditPrefLength(preferences?.preferred_length || "");
                            setEditPrefPace(preferences?.reading_pace || "");

                            setEditMode(true)}}
                        onDelete={handleDeleteRequest}
                        />
                    }
                    {showDeleteProfileModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Delete your profile?</h3>
                                <div className="profile-delete-message-container">
                                    <p>This will delete your preferences and reading history.</p>
                                    <p className="permanent-deletion-message">This action cannot be undone.</p>
                                </div>
                                <div className="modal-buttons">
                                    <button className="modal-cancel" onClick={handleDeleteCancel}>Cancel</button>
                                    <button className="modal-delete" onClick={handleDeleteConfirm}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )}

                <div className="key-buttons-container">
                    <button className="change-password-button" onClick={handleChangePasswordRequest}>
                        Change Password
                    </button>
                    <button className="delete-account-button" onClick={handleDeleteAccountRequest}>
                        Delete Account
                    </button>
                </div>
                
                {showChangePasswordModal &&
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Change your password?</h3>
                            {error && <p className="error">{error}</p>}
                            <div className="password-input-container modal-password-container">
                                <input
                                    className="text-input-field-small" 
                                    type={showCurrentPassword ? "text": "password" }
                                    value={currentPassword}
                                    onChange={(e) => {setCurrentPassword(e.target.value); setError("");}}
                                    placeholder="Current password"
                                />
                                {showCurrentPassword ? <EyeOff className="show-password-icon" onClick={() => setShowCurrentPassword(false)}/> : <Eye className="show-password-icon" onClick={() => setShowCurrentPassword(true)}/>}
                            </div>

                            {newPassword && 
                            <div className="password-change-strength-container">
                                <PasswordStrength password={newPassword} />
                            </div>
                            }
                            
                            <div className="password-input-container modal-password-container">
                                <input
                                    className="text-input-field-small" 
                                    type={showNewPassword ? "text": "password"}
                                    value={newPassword}
                                    onChange={(e) => {setNewPassword(e.target.value); setError("");}}
                                    placeholder="New password"
                                />
                                {showNewPassword ? <EyeOff className="show-password-icon" onClick={() => setShowNewPassword(false)}/> : <Eye className="show-password-icon" onClick={() => setShowNewPassword(true)}/>}
                            </div>
                            
                            <div className="password-input-container modal-password-container">
                                <input
                                    className="text-input-field-small" 
                                    type={showConfirmPassword ? "text": "password"} 
                                    value={newPasswordConfirm}
                                    onChange={(e) => {setNewPasswordConfirm(e.target.value); setError("");}}
                                    placeholder="Confirm new password"
                                />
                                {showConfirmPassword ? <EyeOff className="show-password-icon" onClick={() => setShowConfirmPassword(false)} /> : <Eye className="show-password-icon" onClick={() => setShowConfirmPassword(true)} />}
                            </div>
                            
                            <div className="modal-buttons">
                                <button className="modal-cancel" onClick={() => {
                                    setShowChangePasswordModal(false);
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setNewPasswordConfirm("");
                                    setError("");
                                }}>
                                        Cancel</button>
                                <button className="modal-confirm password-confirm" onClick={() => handleChangePassword(currentPassword, newPassword)}  disabled={!newPassword || newPassword !== newPasswordConfirm}>Confirm</button>
                            </div>

                            {passwordChanged ?
                            <div className="password-changed-container">
                                <p className="password-change-success-message">Password successfully changed!</p>
                                <button className="modal-close" onClick={() => {setShowChangePasswordModal(false); setPasswordChanged(false); setError("");}}>Close</button>
                            </div>
                            : ""}
                        </div>
                    </div>
                }

                {showDeleteAccountModal &&
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Delete your account?</h3>
                            <div className="account-delete-message-container">
                                <p>This will permanently delete your account, profile, reading history, goal history and recommendations</p>
                                <p className="permanent-deletion-message">This action cannot be undone.</p>
                            </div>

                            <input
                                className="delete-account-text-input" 
                                type="text" 
                                value={deleteInput}
                                onChange={(e) => setDeleteInput(e.target.value)}
                                placeholder="Type 'DELETE' to confirm"
                            />

                            <div className="modal-buttons">
                                <button className="modal-cancel" onClick={() => setShowDeleteAccountModal(false)}>Cancel</button>
                                <button className="modal-delete account-delete" onClick={handleDeleteAccount}  disabled={deleteInput !== "DELETE"}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <MobileNavigation />
            <Footer />
        </div>
    );
}