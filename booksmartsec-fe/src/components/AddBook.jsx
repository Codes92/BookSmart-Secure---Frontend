/**
 * @description Add book card component to store books in user library
 */

import { useEffect, useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { searchBook, getBooks } from "../services/api";
import { Loader, BookOpen, Clock } from "lucide-react";

import RegularHeader from "../components/RegularHeader";
import MobileHeader from "./MobileHeader";
import MobileNavigation from "../components/MobileNavigation";
import Footer from "../components/RegularFooter";

import BookSearchResults from "./SearchResultCard";

import "../styles/component-styles/search-book-card.css";

export default function AddBook()
{
    // Request user and logout from AuthContext
    const {user, loading: authLoading} = useAuth();

    const [loading, setLoading] = useState(false);

    // Store error message
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Store search param
    const [searchParam, setSearchParam] = useState("");
    // Store search term (what is actually searched)
    const [searchTerm, setSearchTerm] = useState("");

    // Store search results
    const [searchResults, setSearchResults] = useState([]);

    // Store recently added books
    const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);

    // Get title from recommendations (if the book search is based on a recommendation)
    useEffect(() => {
        if (location.state?.title)
        {
            setSearchTerm(location.state.title);
            setSearchParam("title");
        }
    }, [location.state]);

    // Get recently added books
    useEffect(() => {
        if (user)
        {
            const loadRecentBooks = async () => {
                try
                {
                    const data = await getBooks();
                    const sorted = data.userLibrary
                          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                          .slice(0, 3);
                    setRecentlyAddedBooks(sorted);
                }
                catch (error)
                {
                    setError(error.message);
                }
            }
            loadRecentBooks();
        }
    }, [user]);

    // Logic to handle book search
    const handleBookSearch = async () => {
        setLoading(true);
        setError("");
        try
        {
            const bookResults = await searchBook(searchParam, searchTerm);
            setSearchResults(bookResults.searchResults);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setLoading(false);
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
                    <h1 className="page-title">Search</h1>
                    <p className="page-subheading">Search, discover, and add to your library</p>
                </div>

                <div className="search-book-card">
                    <p className="search-param">Search by title, author or ISBN</p>
                    <div className="search-dropdown-container">
                        {error && <p className="error">{error}</p>}
                        <select className="dropdown-input-field goal-input"
                                value={searchParam}
                                onChange={(e) => setSearchParam(e.target.value)}>
                            <option value="">Select search type</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="isbn">ISBN</option>
                        </select>

                        <input className="text-input-field-small" 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter title, author or ISBN"
                        />
                    </div>
                    
                    <button className="primary-button" onClick={handleBookSearch} disabled={loading}>
                        {loading ? <Loader className="submit-loader-icon" /> : "Search Books"}
                    </button>
                </div>

                <div className="empty-state-container">
                    <Clock size={40} color="var(--primary)"/>
                    <h3 className="empty-space-message">Your most recently added books</h3>
                    <div className="recently-added-books-container">
                        {recentlyAddedBooks.length > 0 ? recentlyAddedBooks.map(book => (
                            <div className="recently-added-book" key={book.book_id}>
                                {book.cover_url ? (
                                <img className="recently-added-cover" src={book.cover_url} alt={book.title}/>
                                ) : (
                                    <div className="book-cover-placeholder"><BookOpen size={40} fill="var(--primary)" color="var(--dark-charcoal)"/></div>
                                )}
                                <div className="clamp-2">
                                    {book.title}
                                </div>
                            </div>
                        )) : <p className="empty-suggestion-message">You haven't added any books recently!</p>}
                    </div>
                </div>
                

                {searchResults?.items?.length > 0 && 
                    <div className="book-search-results">
                        {searchResults.items.map(book => (
                            <BookSearchResults key={book.id} book={book}/>
                        ))}
                    </div>
                }

                <div className="back-to-library-button-container">
                    <button className="go-to-button primary-button" onClick={() => navigate('/library')}>
                        Back to Library
                    </button>
                    <button className="go-to-button primary-button" onClick={() => navigate('/recommendations')}>
                        Recommendations
                    </button>
                </div>
            </div>
            <MobileNavigation />
            <Footer />
        </div>
    );
}