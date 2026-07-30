/**
 * @description Book card component to store books in user library
 */

import { BookOpen, Pencil, Trash2 } from "lucide-react";

import { SHELF_OPTIONS } from "../constants/shelves";

import "../styles/component-styles/book-card.css";

export default function BookCard({book, onView, onDelete, onUpdate})
{
    const shelfLabel = SHELF_OPTIONS.find(o => o.value === book.shelf)?.label || book.shelf;

    return (
        <div className="book-card hoverable-card">

            <div className="book-cover-row">
                {book.cover_url ? (
                    <img className="book-cover" src={book.cover_url} alt={book.title}/>
                ) : (
                    <div className="book-cover-placeholder"><BookOpen size={40} fill="var(--primary)" color="var(--dark-charcoal)"/></div>
                )}
            </div>

            <div className="title-author-row">
                <div className="title-row">
                    <h3 className="clamp-2">{book.title}</h3>
                </div>
                <div className="grey-divider"></div>
                <div className="author-row">
                    <p className="book-author">{book.author_name}</p>
                </div>
            </div>
            
            
            <div className="shelf-row">
                <span className={`badge badge-${book.shelf.toLowerCase().replaceAll(' ', '-')}`}>
                    {shelfLabel}
                </span>
            </div>

            <div className="book-status-row">
                {book.shelf === "reading" && <p className="book-progress">Progress: {book.page_number || 0}/{book.page_count} pages</p>}
                {book.shelf === ""}
                {book.shelf === "finished" && 
                    <p>{book.rating 
                        ? `${'⭐'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}` 
                        : "Rate this book!"}
                    </p>}
                {book.shelf === "did not finish" && <p>Stopped at page: {book.page_number}</p>}
            </div>

            <div className="book-card-button-container">
                <div className="book-card-button-container-top">
                    <button className="primary-button" onClick={() => onView(book.book_id)}>View Details</button>
                </div>
                <div className="book-card-button-container-bottom">
                    <button className="icon-button book-card-update-button" onClick={() => onUpdate(book.book_id)}><Pencil size={20}/></button>
                    <button className="icon-button book-card-delete-button" onClick={() => onDelete(book.book_id)}><Trash2 size={20}/></button>
                </div>
            </div>
        </div>
    );
}