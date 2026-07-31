/**
 * @description Add goal component to store user goals
 */

import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { addUserGoal } from "../services/api";
import { getAllGenres } from "../services/api";
import { stripHtml } from "../utils/sanitise";

import RegularHeader from "./RegularHeader";
import MobileHeader from "./MobileHeader";
import MobileNavigation from "./MobileNavigation";
import Footer from "./RegularFooter";

import "../styles/component-styles/add-goal.css";

export default function AddGoal()
{
    // Request user and logout from AuthContext
    const {user, loading: authLoading} = useAuth();

    // Store error message
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Store goal period
    const [goalPeriod, setGoalPeriod] = useState("");
    // Store goal measure
    const [goalMeasure, setGoalMeasure] = useState("");
    // Store target number
    const [targetNumber, setTargetNumber] = useState("");
    // Store start date
    const [startDate, setStartDate] = useState("");
    // Store end date
    const [endDate, setEndDate] = useState("");
    // Store genre
    const [genre, setGenre] = useState("");

    // Store genre choices
    const [genres, setGenres] = useState([]);

    // Fetch books upon loading
    useEffect (() => {
        const loadGenres = async () => {
            try
            {
                const data = await getAllGenres();
                setGenres(data.result);
            }
            catch (error)
            {
                setError(error.message);
            }
        };
        loadGenres();
    }, []);

    const handleAddGoal = async () => {
        try
        {
            if (!goalPeriod)
            {
                setError("You must select a goal period");
                return;
            }

            if (!goalMeasure)
            {
                setError("You must select a goal measurement");
                return;
            }

            if (!targetNumber)
            {
                setError("You must select a target number");
                return;
            }

            if (!startDate)
            {
                setError("You must select a start date");
                return;
            }

            if (!endDate)
            {
                setError("You must select an end date");
                return;
            }

            const goalData = {
                goalPeriod: goalPeriod,
                goalMeasure: goalMeasure,
                targetNumber: parseInt(stripHtml(targetNumber)),
                startDate: startDate,
                endDate: endDate
            }

            if (genre)
            {
                goalData.genre = genre;
            }

            await addUserGoal(goalData);
            setGoalPeriod("");
            setGoalMeasure("");
            setTargetNumber("");
            setStartDate("");
            setEndDate("");
            setGenre("");
            navigate("/goals");
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

                <div className="page-heading">
                    <h1 className="page-title">Add a goal</h1>
                    <p className="page-subheading">Create a new reading goal</p>
                </div>

                <div className="add-goal-card">

                    {error && <p className="error-message">{error}</p>}

                    <h2 className="goal-enter-title">Enter your goal data</h2>

                    <select className="dropdown-input-field goal-input"
                            value={goalPeriod}
                            onChange={(e) => setGoalPeriod(e.target.value)}>
                        <option value="">Select goal period</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    <select className="dropdown-input-field goal-input"
                            value={goalMeasure}
                            onChange={(e) => setGoalMeasure(e.target.value)}>
                        <option value="">Select goal measure</option>
                        <option value="pages">Pages</option>
                        <option value="books">Books</option>
                    </select>

                    <input className="text-input-field-small goal-input" 
                        type="number" 
                        value={targetNumber}
                        onChange={(e) => setTargetNumber(e.target.value)}
                        placeholder="Set target number"
                    />

                    <input className="date-input-field goal-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                    <input className="date-input-field goal-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    <div className="goal-genre-input">
                        <p>Set a genre (Optional)</p>
                        <select className="dropdown-input-field goal-input" value={genre} onChange={(e) => setGenre(e.target.value)}>
                            <option value="">No genre</option>
                            {genres.map((g) => (
                                <option key={g.genre_id} value={g.genre_id}>{g.genre_name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="goal-buttons-container">
                        <button className="modal-cancel" onClick={() => navigate('/goals')}>Cancel</button>
                        <button className="modal-confirm" onClick={handleAddGoal}>Confirm</button>
                    </div>

                </div>
            </div>

            <div className="back-to-library-button-container">
                <button className="go-to-button button" onClick={() => navigate('/goals')}>
                    Back to Goals
                </button>
            </div>
            <MobileNavigation />
            <Footer />
        </div>
    );
}