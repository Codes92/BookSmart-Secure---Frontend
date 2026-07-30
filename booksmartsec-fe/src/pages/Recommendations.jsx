/**
 * Frontend page for Recommendations
 * Required:
 *      - useState - form field + error/loading state
 *      - useEffect - fetch recommendation upon load
 *      - useNavigate - navigate to other parts of app
 *      - useAuth - user requires login to access Recommendations
 * 
 *      functions:
 *          - addUserRecommendation (get new user recommendation)
 *          - getAllUserRecommendations (fetches existing user recommendations)
 *          - updateUserRecommendations (accept or dismiss a recommendation)
 *          - deleteUserRecommendation (delete a recommendation)
 */

import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { addUserRecommendation, deleteUserRecommendation, getAllUserRecommendations, updateUserRecommendation } from "../services/api";
import { Loader, ThumbsUp, ThumbsDown, Trash2, Sparkles} from "lucide-react";

import RegularHeader from "../components/RegularHeader";
import MobileHeader from "../components/MobileHeader";
import MobileNavigation from "../components/MobileNavigation";
import Footer from "../components/RegularFooter";

import "../styles/page-styles/recommendations.css";

export default function Recommendations()
{
    // Request user and logout from AuthContext
    const {user, loading: authLoading} = useAuth();

    // Store error message
    const [error, setError] = useState("");

    // Enable navigation elsewhere
    const navigate = useNavigate();

    // Store state for loading recommendations
    const [recommendationsLoading, setRecommendationsLoading] = useState(true);

    // Store list of recommendations
    const [recommendations, setRecommendations] = useState([]);

    // Store state for generating new recommendation
    const [generating, setGenerating] = useState(false);

    // Store delete recommendations
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Store recommendation reason for modal overlay
    const [reasonTarget, setReasonTarget] = useState(false);

    // Fetch recommendations on load
    useEffect (() => {
        if (user)
        {
            const loadRecommendations = async () => {
                setRecommendationsLoading(true)
                try
                {
                    const data = await getAllUserRecommendations();
                    setRecommendations(data.allRecommendations);
                }
                catch (error)
                {
                    setError(error.message);
                }
                finally
                {
                    setRecommendationsLoading(false);
                }
            }
            loadRecommendations();
        }
    }, [user]);

    // 
    const loadRecommendations = async () => {
        setRecommendationsLoading(true)
        try
        {
            const data = await getAllUserRecommendations();
            setRecommendations(data.allRecommendations);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setRecommendationsLoading(false);
        }
    }

    // Logic to handle generate request
    const handleGenerateRecommendationRequest = async () => {
        try
        {
            setGenerating(true)
            await addUserRecommendation();
            await loadRecommendations();
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setGenerating(false);
        }
    }

    // Logic to handle delete request
    const handleDeleteRequest = (recommendationId) => {
        setDeleteTarget(recommendationId);
    }

    // Logic to confirm recommendation deletion
    const handleDeleteConfirm = async () => {
        try
        {
            await deleteUserRecommendation(deleteTarget);
            // Refresh book list after deletion
            setRecommendations(prev => prev.filter(r => r.recommendation_id !== deleteTarget));
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setDeleteTarget(null);
        }
    }

    // Logic to cancel recommendation deletion
    const handleDeleteCancel = () => {
        setDeleteTarget(null);
    }

    const handleUpdateStatus = async (recommendationId, newStatus) => {
        try
        {
            await updateUserRecommendation(recommendationId, newStatus);
            await loadRecommendations();
        }
        catch (error)
        {
            setError(error.message);
        }
    }

    if (authLoading)
    {
        return <div>Loading...</div>
    }

    if (!user)
    {
        return null;
    }

    return (
        <div className="page-wrapper">

            <RegularHeader />
            <MobileHeader />

            <div className="page-content">
                {error && <p className="error-message">{error}</p>}

                <div className="page-heading">
                    <h1 className="page-title">AI Recommendations</h1>
                    <p className="page-subheading">Discover books tailored to your reading habits, favourite genres, reading pace, and library history.</p>
                </div>

                <div className="add-item-container">
                    <button className="add-recommendation-button" 
                            onClick={handleGenerateRecommendationRequest} disabled={generating}>
                        {generating ? <Loader className="submit-loader-icon" /> : "Get a recommendation"}
                    </button>
                     <p className="add-item-message">Discover your next perfect read with AI</p>
                </div>

                <div className="content-grid mobile-bottom-clearance">
                    {recommendationsLoading ? (
                        <div className="empty-state-container">
                            <Loader className="submit-loader-icon" color="var(--primary-hover)"/>
                            <p className="loading-message">Loading your recommendations...</p>
                        </div>)
                    : recommendations.length === 0 ? (
                        <div className="empty-state-container">
                            <Sparkles size={40} color="var(--primary)"/>
                            <h3 className="empty-space-message">No recommendations yet!</h3>
                            <p className="empty-suggestion-message">Use the add button to get an AI-powered recommendation</p>
                        </div>)
                    : (
                        recommendations.map(recommendation => (
                            <div className="recommendation-card hoverable-card" key={recommendation.recommendation_id}>
                                <h3 className="clamp-2">{recommendation.title}</h3>
                                <div className="grey-divider"></div>
                                <p className="book-author">{recommendation.author_name}</p>

                                <div className="recommendation-reason-container">
                                    <button className="recommendation-reason-button" onClick={() => setReasonTarget(recommendation)}>Tell me more</button>
                                </div>
                                
                                <div className="recommendation-status-container">
                                    <p className="recommendation-status">{recommendation.status[0].toUpperCase() + recommendation.status.slice(1)}</p>
                                    {recommendation.status === "dismissed" && recommendation.dismissed_at && <p className="dismissed-recommendation-text">{recommendation.dismissed_at.split("T")[0]}</p>}
                                    {recommendation.status === "accepted" && <button className="find-recommendation-button" onClick={() => navigate('/add-book', {state: {title: recommendation.title}})}>Find this book?</button>}
                                </div>
                                
                                <div className="recommendation-status-buttons-container">
                                    {recommendation.status === "pending" && <button className="icon-button accept-recommendation-button" onClick={() => handleUpdateStatus(recommendation.recommendation_id, "accepted")}><ThumbsUp /></button>}
                                    {recommendation.status === "pending" && <button className="icon-button dismiss-recommendation-button" onClick={() => handleUpdateStatus(recommendation.recommendation_id, "dismissed")}><ThumbsDown /></button>}
                                    <button className="icon-button delete-recommendation-button" onClick={() => handleDeleteRequest(recommendation.recommendation_id)}><Trash2 /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                    {reasonTarget && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>{reasonTarget.title}</h3>
                                <p className="recommendation-reason">{reasonTarget.reason}</p>
                                <div className="modal-buttons">
                                    <button className="modal-close" onClick={() => setReasonTarget(null)}>Close</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {deleteTarget && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3 className="delete-recommendation-message">Delete this recommendation?</h3>
                                <p className="permanent-deletion-message">This action cannot be undone</p>
                                <div className="modal-buttons">
                                    <button className="modal-cancel" onClick={handleDeleteCancel}>Cancel</button>
                                    <button className="modal-delete" onClick={handleDeleteConfirm}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="ai-disclaimer-container">
                        <p className="ai-disclaimer">
                            This feature is powered by AI and may occasionally return inaccurate, incomplete, or unexpected results. Requests may also fail due to service availability, network issues, or model limitations.
                        </p>
                    </div>
            </div>
            <MobileNavigation />
            <Footer />
        </div>
    );
}