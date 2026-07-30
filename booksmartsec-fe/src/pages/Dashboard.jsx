import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate} from "react-router-dom";
import { getAllUserRecommendations, getBooks, getUserGoals } from "../services/api";
import { BookOpen, CalendarDays, Bookmark, Star } from "lucide-react";

import RegularHeader from "../components/RegularHeader";
import MobileHeader from "../components/MobileHeader";
import MobileNavigation from "../components/MobileNavigation";
import RegularFooter from "../components/RegularFooter";

import "../styles/page-styles/dashboard.css";
import "../styles/component-styles/book-card.css";

export default function Dashboard()
{
    // Request user and logout from AuthContext
    const {user, loading: authLoading} = useAuth();

    // Show message when login fails
    const [error, setError] = useState("");

    // Enables user to be re-routed
    const navigate = useNavigate();

    // Store state for loading dashboard
    const [dashboardLoading, setDashboardLoading] = useState(true);

    // Store books to display a selected amount to the user
    const [books, setBooks] = useState([]);

    // Store list of recommendations (change to single recommendation)
    const [recommendations, setRecommendations] = useState([]);

    // Store a current user goal if there is at least one
    const [goals, setGoals] = useState([]);

    // Fetch content (books, recommendations, goals) from throughout the application upon login
    useEffect (() => {
        if (user)
        {
            const loadDashboard = async () => {
                setDashboardLoading(true);
                try
                {
                    const [booksData, recommendationsData, goalsData] = await Promise.all([
                        getBooks(),
                        getAllUserRecommendations(),
                        getUserGoals()
                    ]);
                    setBooks(booksData.userLibrary);
                    setRecommendations(recommendationsData.allRecommendations);
                    setGoals(goalsData.userGoals || []);
                }
                catch (error)
                {
                    setError(error.message);
                }
                finally
                {
                    setDashboardLoading(false);
                }
            };
            loadDashboard();    
        }
    }, [user]);

    // ============= ROTATION FOR BOOKS ============ //
    // Filter books currently being read by user
    const currentlyReading = books.filter(b => b.shelf === "reading");
    // Store current index (to start rotation)
    const [readingIndex, setReadingIndex] = useState(0);

    useEffect(() => {
        // No rotation if currently reading books fewer than two
        if (currentlyReading.length <= 1)
        {
            return;
        }

        const rotationInterval = setInterval(() => {
            setReadingIndex(prev => (prev + 1) % currentlyReading.length);
        }, 8000); // 8 seconds

        // Cleanup
        return () => clearInterval(rotationInterval);
    }, [currentlyReading.length]);

    const displayedBook = currentlyReading[readingIndex];

    // ============ ROTATION FOR RECOMMENDATIONS ============
    const unhandledRecommendations = recommendations.filter(r => r.status === "pending");
    // Store current index
    const [recommendationIndex, setRecommendationIndex] = useState(0);

    useEffect(() => {
        // No rotation if currently reading books fewer than two
        if (unhandledRecommendations.length <= 1)
        {
            return;
        }

        const rotationInterval = setInterval(() => {
            setRecommendationIndex(prev => (prev + 1) % unhandledRecommendations.length);
        }, 8000); // 8 seconds

        // Cleanup
        return () => clearInterval(rotationInterval);
    }, [unhandledRecommendations.length]);

    const displayedRecommendation = unhandledRecommendations[recommendationIndex];

    // ============ URGENT RECOMMENDATIONS ============
    const mostUrgentGoal = goals.filter(readingGoal => (readingGoal.current_progress < readingGoal.target_number) && (new Date() < new Date(readingGoal.end_date)))
                           .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))[0];

    const todaysDate = new Date();
    const completionDate = mostUrgentGoal ? new Date(mostUrgentGoal.end_date) : null;
    
    const remainingBooks = mostUrgentGoal ? mostUrgentGoal.target_number - mostUrgentGoal.current_progress : 0;
    const measureSingular = mostUrgentGoal?.goal_measure === "books" ? "book": "page";
    const measureLabel = remainingBooks === 1 ? measureSingular : mostUrgentGoal?.goal_measure;

    
    // ============ QUICK STATS ============
    const totalBooksRead = books.filter(b => b.shelf === "finished");
    const booksThisYear = books.filter(b => b.shelf === "finished" && b.date_finished && new Date(b.date_finished).getFullYear() === new Date().getFullYear());
    const wantToReadCount = books.filter(b => b.shelf ==="want to read");

    let totalRatingValue = 0;
    let ratedCount = 0;
    for (let i = 0; i < totalBooksRead.length; ++i)
    {
        if (totalBooksRead[i].rating)
        {
            totalRatingValue += totalBooksRead[i].rating;
            ratedCount += 1;
        }
    }
    const averageRating = ratedCount > 0 ? Math.floor(totalRatingValue / ratedCount) : null;

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

                <div className="dashboard-greeting">
                    <h1>Hello, {user.username}</h1>
                </div>

                <div className="page-heading">
                    <h1 className="page-title">Your Dashboard</h1>
                    <p className="page-subheading">Your reading, at a glance</p>
                </div>

                <div className="dashboard-container">

                    <div className="dashboard-basic-analytics-container">
                        <h2 className="dashboard-section-heading">Your current library by numbers</h2>
                        {dashboardLoading ? (
                            <p className="loading-message">Loading your numbers...</p>
                        ) : (
                            <div className="dashboard-basic-analytics">
                                <div className="dashboard-metric-container">
                                    <BookOpen className="dashboard-icon" size={40}/>
                                    <div className="dashboard-value">
                                        <h2 className="dashboard-metric-value">{totalBooksRead.length}</h2>
                                    </div>
                                    <p className="dashboard-metric-key">Total books you've read</p>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="dashboard-metric-container">
                                    <CalendarDays className="dashboard-icon" size={40}/>
                                    <div className="dashboard-value">
                                        <h2 className="dashboard-metric-value">{booksThisYear.length}</h2>
                                    </div>
                                    <p className="dashboard-metric-key">Books you've read this year</p>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="dashboard-metric-container">
                                    <Bookmark className="dashboard-icon" size={40} />
                                    <div className="dashboard-value">
                                        <h2 className="dashboard-metric-value">{wantToReadCount.length}</h2>
                                    </div>
                                    <p className="dashboard-metric-key">Books you want to read</p>
                                </div>
                                <div className="vertical-divider"></div>
                                <div className="dashboard-metric-container">
                                    <Star className="dashboard-icon" size={40}/>
                                    <div className="dashboard-value">
                                        <h2 className="dashboard-metric-value">{averageRating}</h2>
                                    </div>
                                    <p className="dashboard-metric-key">Your average rating</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="thick-grey-divider"></div>

                    <div className="dashboard-middle-section">
                        <div className="current-reads-container">
                            <h2 className="dashboard-section-heading">What you're currently reading</h2>
                            {dashboardLoading ? (
                                <p className="loading-message">Loading your books...</p>)
                            : currentlyReading.length === 0 ? (
                                <p className="dashboard-empty-message">Not currently reading anything!</p>)
                            : (
                                <div className="rotating-book">
                                    {displayedBook.cover_url ? 
                                        <img className="dashboard-book-cover" src={displayedBook.cover_url}/>
                                    :   <div className="book-cover-placeholder"><BookOpen size={40} fill="var(--primary)" color="var(--dark-charcoal)"/></div>
                                    }
                                    <h3 className="book-card-title">{displayedBook.title}</h3>
                                    <div className="grey-divider"></div>
                                    <p className="book-author">{displayedBook.author_name}</p>
                                    <p>Progress: <span className="bold-metric">{displayedBook.page_number || "0"}/{displayedBook.page_count} pages</span></p>
                                </div>
                            )}
                            <button className="go-to-button primary-button" onClick={() => navigate('/library')}>
                                Go to Library
                            </button>
                        </div>
                        
                        <div className="upcoming-goals-container">
                            <h2 className="dashboard-section-heading">Upcoming goals</h2>
                            {dashboardLoading ? (
                                <p className="loading-message">Loading your goals...</p>) 
                            : !mostUrgentGoal ? (
                                <p className="dashboard-empty-message">All goals completed!</p>)
                            : (
                                <div className="dashboard-goal">
                                    <div className="goal-title-container">
                                        <h3 className="goal-title">{mostUrgentGoal.goal_period[0].toUpperCase() + mostUrgentGoal.goal_period.slice(1)} Goal</h3>
                                        <div className="goal-title-underline"></div>
                                    </div>
                                    <div className="completion-container">
                                        <div className="completion-date-container">
                                            <p className="goal-completion-date">Completion Date:</p>
                                            <p className="completion-date-message">{mostUrgentGoal.end_date.split("T")[0]}</p>
                                        </div>
                                        <h4 className="days-remaining">{Math.ceil((completionDate - todaysDate) / (1000 * 60 * 60 * 24))} days left</h4>
                                    </div>

                                    <div className="goal-target">
                                        <p className="goal-metric-target-number">{mostUrgentGoal.current_progress} / {mostUrgentGoal.target_number}</p>
                                        <p className="goal-measure">{mostUrgentGoal.goal_measure[0].toUpperCase() + mostUrgentGoal.goal_measure.slice(1)}</p>
                                    </div>
                                    
                                    <div className="goal-progress-bar-track">
                                        <div className="goal-progress-bar-fill"
                                                style={{width: `${Math.min((mostUrgentGoal.current_progress / mostUrgentGoal.target_number) * 100, 100)}%`}}>                                            
                                        </div>
                                    </div>
                                    <div className="goal-remaining">
                                        <h4 className="goal-remaining-message">
                                            You have {mostUrgentGoal.target_number - mostUrgentGoal.current_progress} {measureLabel} remaining!
                                        </h4>
                                    </div>
                                </div>
                            )}
                            <button className="go-to-button primary-button" onClick={() => navigate('/goals')}>
                                Go to Goals
                            </button>
                        </div>
                    </div>

                    <div className="thick-grey-divider"></div>

                    <div className="dashboard-recommendations-container">
                        <h2 className="dashboard-section-heading">Try reading these...</h2>
                        {dashboardLoading ? (
                            <p className="loading-message">Loading your recommendations...</p>)
                        : unhandledRecommendations.length === 0 ? (
                            <p className="dashboard-empty-message">No pending recommendations!</p>)
                        : (
                            <div className="dashboard-recommendation-card">
                                <div className="book-cover-placeholder"><BookOpen size={40} fill="var(--primary)" color="var(--dark-charcoal)"/></div>
                                <h3>{displayedRecommendation.title}</h3>
                                <div className="grey-divider"></div>
                                <p>{displayedRecommendation.author_name}</p>
                                <button className="find-recommendation-button" onClick={() => navigate('/add-book')}>
                                    Find this book?
                                </button>
                            </div>
                        )}
                        <button className="go-to-button primary-button" onClick={() => navigate('/recommendations')}>
                            Recommendations
                        </button>
                    </div>
                </div>
            </div>
            <MobileNavigation />
            <RegularFooter />

        </div>
    );
}