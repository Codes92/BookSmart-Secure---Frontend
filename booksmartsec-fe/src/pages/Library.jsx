/**
 * Frontend page for Library
 * Required:
 *      - useState - form field + error/loading state
 *      - useEffect -
 *      - useNavigate - for redirecting after login
 *      - useAuth - user requires login to access Library
 * 
 *      functions:
 *          - getBooks (get all user books to furnish library)
 *          - updateBook (enable updating book in user library)
 *          - deleteBook (enable deletion of book from user library)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { getBooks, updateBook, deleteBook } from "../services/api";
import { Plus, Loader, BookOpen } from "lucide-react";

import RegularHeader from "../components/RegularHeader";
import MobileHeader from "../components/MobileHeader";
import MobileNavigation from "../components/MobileNavigation";
import BookCard from "../components/BookCard";
import Footer from "../components/RegularFooter";

import { SHELF_OPTIONS } from "../constants/shelves";

import "../styles/page-styles/library.css";

export default function Library()
{
    // Request user and logout from AuthContext
    const {user, loading: authLoading} = useAuth();

    // Store error message
    const [error, setError] = useState("");

    // Enables user to be re-routed
    const navigate = useNavigate();

    // Store state for loading books
    const [booksLoading, setBooksLoading] = useState(true);

    // Store books grid
    const [books, setBooks] = useState([]);
    // Store filter to arrange library
    const [filter, setFilter] = useState("All");

    // Store delete books
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Store update books
    const [updateTarget, setUpdateTarget] = useState(null);

    // Enable viewing of book details
    const [viewTarget, setViewTarget] = useState(null);

    // Store book updates
    const [updateShelf, setUpdateShelf] = useState("");
    const [updateRating, setUpdateRating] = useState("");
    const [updatePageNumber, setUpdatePageNumber] = useState("");

    // Fetch books upon loading
    useEffect (() => {
        if (user)
        {
            const loadBooks = async () => {
                setBooksLoading(true);
                try
                {
                    const data = await getBooks();
                    setBooks(data.userLibrary);
                }
                catch (error)
                {
                    setError(error.message);
                }
                finally
                {
                    setBooksLoading(false);
                }
            };
            loadBooks();    
        }
    }, [user]);

    const fetchBooks = async (filterValue) => {
        setBooksLoading(true);
        try
        {
            const data = filterValue === "All" ? await getBooks() : await getBooks({shelf: filterValue});
            setBooks(filterValue === "All" ? data.userLibrary : data.bookshelf);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setBooksLoading(false);
        }
    }

    // Logic to handle filter change in library
    const handleFilterChange = (filterValue) => {
        setFilter(filterValue);
        fetchBooks(filterValue);
    }

    // Logic to handle delete request
    const handleDeleteRequest = (bookId) => {
        setDeleteTarget(bookId);
    }

    // Logic to confirm book deletion
    const handleDeleteConfirm = async () => {
        try
        {
            await deleteBook(deleteTarget);
            // Refresh book list after deletion
            setBooks(prev => prev.filter(b => b.book_id !== deleteTarget));
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

    // Logic to cancel book deletion
    const handleDeleteCancel = () => {
        setDeleteTarget(null);
    }

    // Logic to view details of book in modal
    const handleViewRequest = (bookId) => {
        const book = books.find(b => b.book_id === bookId);
        setViewTarget(book);
    }

    // Logic to handle update requests
    const handleUpdateRequest = (bookId) => {
        setUpdateTarget(bookId);

        // Locate book to prepopulate it with current user data
        const book = books.find(b => b.book_id === bookId);

        setUpdateShelf(book.shelf);
        setUpdatePageNumber(book.page_number);
        setUpdateRating(book.rating);

    }

    // Logic to confirm update request
    const handleUpdateConfirm = async () => {
        try
        {
            const updates = {};
            if (updateShelf)
            {
                updates.shelf = updateShelf;
            }
            if (updateRating)
            {
                updates.rating = updateRating;
            }
            if (updatePageNumber)
            {
                updates.pageNumber = updatePageNumber;
            }

            if (updatePageNumber && books.find(b => b.book_id === updateTarget)?.page_count)
            {
                const book = books.find(b => b.book_id === updateTarget);
                if (parseInt(updatePageNumber) > book.page_count)
                {
                    setError("Page number cannot exceed total pages");
                    return;
                }
            }

            await updateBook(updateTarget, updates);
            // Refresh book list after update
            await fetchBooks(filter);
        }
        catch (error)
        {
            setError(error.message);
        }
        finally
        {
            setUpdateTarget(null);
            setUpdateShelf("");
            setUpdateRating("");
            setUpdatePageNumber("");
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
                    <h1 className="page-title">Your Library</h1>
                    <p className="page-subheading">Access, manage and search for books</p>
                </div>

                <div className="add-item-container">
                    <button className="add-item-button" onClick={() => navigate('/add-book')}>
                        <Plus />
                    </button>
                    <p className="add-item-message">Search millions of books worldwide</p>
                </div>

                <div className="shelf-switch-dropdown">
                    <select className="dropdown-input-field" value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
                        {SHELF_OPTIONS.map(({value, label}) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="shelf-switch-container">
                    {SHELF_OPTIONS.map(({value, label}) => (
                        <button key={value} 
                                className={`shelf-switch-button ${filter === value ? "active" : ""}`}
                                onClick={() => handleFilterChange(value)}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="content-grid mobile-bottom-clearance">
                    {booksLoading ? (
                        <div className="empty-state-container">
                            <Loader className="submit-loader-icon" color="var(--primary-hover)"/>
                            <p className="library-loading-message">Loading your books...</p>
                        </div>
                        )
                    : books.length === 0 ? (
                        <div className="empty-state-container">
                            <BookOpen size={40} color="var(--primary)"/>
                            <h3 className="empty-space-message">No books yet!</h3>
                            <p className="empty-suggestion-message">Use the add-book button to add books to your library</p>
                        </div>
                        )
                    : (
                        books.map(book => (
                            <BookCard key={book.book_id} book={book} onView={handleViewRequest} onUpdate={handleUpdateRequest} onDelete={handleDeleteRequest}/>
                        ))
                    )}
                </div>

                {viewTarget && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3 className="modal-title">{viewTarget.title}</h3>
                            <div className="modal-fields">
                                <p>ISBN: <span className="bold-metric">{viewTarget.isbn_number || "Unavailable"}</span></p>
                                <p>Published: <span className="bold-metric">{viewTarget.publication_year || "Unavailable"}</span></p>
                                <p>Publisher: <span className="bold-metric">{viewTarget.publisher || "Unavailable"}</span></p>
                                <p>Print Language: <span className="bold-metric">{viewTarget.print_language.toUpperCase() || "Unavailable"}</span></p>
                                <p>Page Count: <span className="bold-metric">{viewTarget.page_count || "Unavailable"}</span></p>
                            </div>
                            <button className="modal-cancel primary-button view-details-button" onClick={() => setViewTarget(null)}>
                                Go back
                            </button>
                        </div>
                    </div>
                )}

                {updateTarget && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3 className="modal-title">Update this book?</h3>

                            <div className="modal-fields update-modal">
                                <select 
                                    className="dropdown-input-field"
                                    value={updateShelf}
                                    onChange={(e) => setUpdateShelf(e.target.value)}>
                                    <option value="">Select shelf</option>
                                    <option value="reading">Reading</option>
                                    <option value="finished">Finished</option>
                                    <option value="want to read">Want to Read</option>
                                    <option value="did not finish">Did Not Finish</option>
                                </select>

                                <input className="text-input-field-small" 
                                    type="number"
                                    value={updateRating}
                                    onChange={(e) => setUpdateRating(e.target.value)}
                                    placeholder="Rating (1-5)"
                                    min="1"
                                    max="5"
                                />

                                <input className="text-input-field-small"
                                    type="text"
                                    value={updatePageNumber}
                                    onChange={(e) => setUpdatePageNumber(e.target.value)}
                                    placeholder="Current page"
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
                            <h3 className="delete-book-message">Delete this book?</h3>
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