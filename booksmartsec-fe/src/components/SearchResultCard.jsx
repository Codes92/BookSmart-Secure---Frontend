/**
 * @description Search results component to store books in user library
 */

import { useState } from "react";
import { addBook } from "../services/api";
import { BookOpen } from "lucide-react";

import "../styles/component-styles/search-results-card.css";

export default function BookSearchResults({book})
{
    const [error, setError] = useState("");

    // Get shelf from user
    const [shelf, setShelf] = useState("");

    // Show visual feedback to user to inform of successful adding
    const [added, setAdded] = useState(false);

    const handleAddBook = async () => {
        try
        {
            if (!shelf)
            {
                setError("Please select a shelf");
                return;
            }

            await addBook({bookId: book.id, shelf: shelf});
            setAdded(true);

        }
        catch (error)
        {
            setError(error.message);
        }
    }

    return (
        <div className="search-result-card hoverable-card">
            
            <div className="book-cover-row">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img className="search-book-cover" src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title}/>
                ) : (
                    <div className="book-cover-placeholder"><BookOpen size={40} fill="var(--primary)" color="var(--dark-charcoal)"/></div>
                )}
            </div>

            <h3 className="clamp-2">{book.volumeInfo.title}</h3>
            <p className="search-book-author">{book.volumeInfo.authors?.[0]}</p>

            <select 
                className="dropdown-input-field search-dropdown"
                value={shelf}
                onChange={(e) => {setShelf(e.target.value); setError("");}}>
                <option value="">Add to your shelf</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
                <option value="want to read">Want to Read</option>
                <option value="did not finish">Did Not Finish</option>
            </select>

            {error && <p className="error">{error}</p>}

            {added ? <p className="success-message">Added to library ✓</p> 
            : <button className="primary-button search-add-book-button" onClick={handleAddBook}>
                    Add Book
                </button>
            }
        </div>
    );
}