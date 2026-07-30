/**
 * Frontend page for Goals
 * Required:
 *      - useState - form field + error/loading state
 *      - useEffect -
 *      - useNavigate - for redirecting after login
 *      - useAuth - user requires login to access Goals
 * 
 *      functions:
 *          - addUserGoal (enable user to add new reading goal)
 *          - getUserGoals (get all user goals)
 *          - getUserGoalByStatus (get specific user goals)
 *          - updateUserGoal (enable updating of user goal)
 *          - deleteUserGoal (enable deletion of user goal)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { getUserGoals, getUserGoalsByStatus, updateUserGoal, deleteUserGoal } from "../services/api";
import { Plus, Pencil, Trash2, Calendar, PartyPopper, Target, Loader } from "lucide-react";

import RegularHeader from "../components/RegularHeader";
import MobileHeader from "../components/MobileHeader";
import MobileNavigation from "../components/MobileNavigation";
import Footer from "../components/RegularFooter";

import { STATUS_OPTIONS } from "../constants/status";

import "../styles/page-styles/goals.css";

export default function Goals()
{
    // Request user and logout from AuthContext
    const {user, loading: authLoading} = useAuth();

    // Store error message
    const [error, setError] = useState("");

    // Enables user to be re-routed
    const navigate = useNavigate();

    // Store state for loading goals
    const [goalsLoading, setGoalsLoading] = useState(true);

    // Store goals grid
    const [goals, setGoals] = useState([]);
    // Store status to retrieve specific goals
    const [status, setStatus] = useState("All");

    // Store delete goal
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Store update goal
    const [updateTarget, setUpdateTarget] = useState(null);

    // Store goal updates
    const [updateGoalPeriod, setUpdateGoalPeriod] = useState("");
    const [updateGoalMeasure, setUpdateGoalMeasure] = useState("");
    const [updateTargetNumber, setUpdateTargetNumber] = useState("");
    const [updateStartDate, setupdateStartDate] = useState("");
    const [updateEndDate, setUpdateEndDate] = useState("");
    const [updateGenre, setUpdateGenre] = useState("");


    // Fetch books upon loading
    useEffect (() => {
        if (user)
        {
            const loadGoals = async () => {
                setGoalsLoading(true);
                try
                {
                    const data = await getUserGoals();
                    setGoals(data.userGoals);
                }
                catch (error)
                {
                    setError(error.message);
                }
                finally
                {
                    setGoalsLoading(false);
                }
            };
            loadGoals();    
        }
    }, [user]);

    const fetchGoals = async (statusValue) => {
        setGoalsLoading(true);
        try
        {
            const data = statusValue === "All" ? await getUserGoals() : await getUserGoalsByStatus(statusValue);
            setGoals(statusValue === "All" ? data.userGoals : data.goalsByStatus);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setGoalsLoading(false);
        }
    }

    // Logic to handle filter change in library
    const handleStatusChange = (statusValue) => {
        setStatus(statusValue);
        fetchGoals(statusValue);
    }

    // Logic to handle delete request
    const handleDeleteRequest = (goalId) => {
        setDeleteTarget(goalId);
    }

    // Logic to confirm book deletion
    const handleDeleteConfirm = async () => {
        try
        {
            await deleteUserGoal(deleteTarget);
            // Refresh goal list after deletion
            setGoals(prev => prev.filter(g => g.goal_id !== deleteTarget));
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

    // Logic to cancel goal deletion
    const handleDeleteCancel = () => {
        setDeleteTarget(null);
    }

    // Logic to handle update requests
    const handleUpdateRequest = (goalId) => {
        setUpdateTarget(goalId);

        // Locate selected goal to prepopulate it with current user data
        const goal = goals.find(g => g.goal_id === goalId);

        setUpdateGoalPeriod(goal.goal_period);
        setUpdateGoalMeasure(goal.goal_measure);
        setUpdateTargetNumber(goal.target_number);
    }

    // Logic to handle update
    const handleUpdateConfirm = async () => {
        try
        {
            const updates = {};
            if (updateGoalPeriod)
            {
                updates.goalPeriod = updateGoalPeriod;
            }
            if (updateGoalMeasure)
            {
                updates.goalMeasure = updateGoalMeasure;
            }
            if (updateTargetNumber)
            {
                updates.targetNumber = parseInt(updateTargetNumber);
            }
            if (updateStartDate)
            {
                updates.startDate = updateStartDate;
            }
            if (updateEndDate)
            {
                updates.endDate = updateEndDate;
            }
            if (updateGenre)
            {
                updates.genre = updateGenre;
            }

            await updateUserGoal(updateTarget, updates);
            // Refresh goal list after update
            await fetchGoals(status);
        }
        catch (error)
        {
            setError(error.message)
        }
        finally
        {
            setUpdateTarget(null);
            setUpdateGoalPeriod("");
            setUpdateGoalMeasure("");
            setUpdateTargetNumber("");
            setupdateStartDate("");
            setUpdateEndDate("");
            setUpdateGenre("");
        }
    }

    // Logic to cancel update request
    const handleUpdateCancel = () => {
        setUpdateTarget(null);
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
                    <h1 className="page-title">Your Goals</h1>
                    <p className="page-subheading">Create and manage reading goals</p>
                </div>

                <div className="add-item-container">
                    <button className="add-item-button" onClick={() => navigate('/add-goal')}>
                        <Plus />
                    </button>
                    <p className="add-item-message">Set targets, track progress, read more</p>
                </div>

                <div className="goal-status-switch-dropdown">
                    <select className="dropdown-input-field goal-dropdown" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                        {STATUS_OPTIONS.map(({value, label}) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="content-grid mobile-bottom-clearance">
                    {goalsLoading ? (
                        <div className="empty-state-container">
                            <Loader className="submit-loader-icon" color="var(--primary-hover)"/>
                            <p className="loading-message">Loading your goals...</p>
                        </div>)
                    : goals.length === 0 ? (
                        <div className="empty-state-container">
                            <Target size={40} color="var(--primary)"/>
                            <h3 className="empty-goals-message">No goals yet!</h3>
                            <p className="empty-suggestion-message">Use the add-goal button to set a reading goal</p>
                        </div>)
                    : (
                        goals.map(goal => (
                            <div className="goal-card hoverable-card" key={goal.goal_id}>
                                <div className="goal-title-container">
                                    <h3 className="goal-title">{goal.goal_period[0].toUpperCase() + goal.goal_period.slice(1)} Goal</h3>
                                    <div className="goal-title-underline"></div>
                                </div>
                                <div className="concrete-goal-container">
                                    <div className="goal-target">
                                        <p className="goal-metric-target-number">{goal.current_progress} / {goal.target_number}</p>
                                        <p className="goal-measure">{goal.goal_measure[0].toUpperCase() + goal.goal_measure.slice(1)}</p>
                                    </div>
                                    <div className="goal-progress-bar-track">
                                        <div className="goal-progress-bar-fill"
                                             style={{width: `${Math.min((goal.current_progress / goal.target_number) * 100, 100)}%`}}>                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="start-end-dates-container">
                                    <div className="start-date-inner-container">
                                        <Calendar size={16}/>
                                        <p className="goal-metric-date">Goal start:</p>
                                        <p className="goal-date">{goal.start_date.split("T")[0]}</p>
                                    </div>
                                    <div className="start-date-inner-container">
                                        <PartyPopper size={16}/>
                                        <p className="goal-metric-date">Goal end:</p>
                                        <p className="goal-date">{goal.end_date.split("T")[0]}</p>
                                    </div>
                                </div>
                                {goal.genre && <p className="goal-genre-metric">{goal.genre}</p>}

                                <div className="goal-card-button-container">
                                    <button className="icon-button update-goal-button" onClick={() => handleUpdateRequest(goal.goal_id)}><Pencil /></button>
                                    <button className="icon-button delete-goal-button" onClick={() => handleDeleteRequest(goal.goal_id)}><Trash2 /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {updateTarget && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3 className="update-book-message">Update this goal?</h3>

                            <div className="modal-fields goal-update-fields-container">
                                <select className="dropdown-input-field"
                                        value={updateGoalPeriod}
                                        onChange={(e) => setUpdateGoalPeriod(e.target.value)}>
                                    <option value="">Select goal period</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>

                                <select className="dropdown-input-field"
                                        value={updateGoalMeasure}
                                        onChange={(e) => setUpdateGoalMeasure(e.target.value)}>
                                    <option value="">Select goal measure</option>
                                    <option value="pages">Pages</option>
                                    <option value="books">Books</option>
                                </select>

                                <input className="text-input-field-small" 
                                    type="number" 
                                    value={updateTargetNumber}
                                    onChange={(e) => setUpdateTargetNumber(e.target.value)}
                                    placeholder="Set target number"
                                />

                                <input className="date-input-field"
                                    type="date"
                                    value={updateStartDate}
                                    onChange={(e) => setupdateStartDate(e.target.value)}
                                />

                                <input className="date-input-field"
                                    type="date"
                                    value={updateEndDate}
                                    onChange={(e) => setUpdateEndDate(e.target.value)}
                                />
                            </div>

                            <div className="modal-buttons">
                                <button className="modal-cancel" onClick={handleUpdateCancel}>Cancel</button>
                                <button className="modal-confirm" onClick={handleUpdateConfirm}>Update</button>
                            </div>
                        </div>
                    </div>
                )}
                {deleteTarget && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3 className="delete-goal-message">Delete this goal?</h3>
                            <p className="permanent-deletion-message">This action cannot be undone</p>
                            <div className="modal-buttons">
                                <button className="modal-cancel" onClick={handleDeleteCancel}>Cancel</button>
                                <button className="modal-delete" onClick={handleDeleteConfirm}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <MobileNavigation />
            <Footer />
        </div>
    );
}