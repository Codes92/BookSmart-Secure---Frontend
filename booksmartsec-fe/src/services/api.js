/* Base url from which API functions can attach specific routes to */
const BASE_URL = import.meta.env.VITE_API_URL;

// ==================== AUTHENTICATION API FUNCTIONS ====================
// ======================================================================

/**
 * @description Register user on frontend
 * @param {string} email - Chosen user email address linked to account
 * @param {string} username - Chosen username for account
 * @param {string} password - Chosen password for account
 * @returns
 */
export async function userRegister(email, username, password)
{
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, username, password})
    });

    if (!response.ok)
    {
        const errorData = await response.text();
        throw new Error(errorData.error || "Registration failed");
    }

    const data = await response.json();

    return data;
}

/**
 * @description Log in user from frontend
 * @param {string} email - Email used to access account
 * @param {string} password - User password
 * @returns 
 */
export async function userLogin(email, password)
{   
    // Send an HTTP request to backend login endpoint
    // await pauses the execution until the server responds
    // Store the result inside response
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST", // Sends data
        credentials: "include",
        headers: {
            "Content-Type": "application/json" // Tells server app is sending JSON data (without this, Express won't parse body properly)
        },
        body: JSON.stringify({email, password}) // Converts data into JSON text and sends it in request body
    });

    // Check whether HTTP status indicates success
    if (!response.ok)
    {
        // If not successful, throw an error
        const errorData = await response.text();
        throw new Error(errorData.error || "Login failed");
    }

    // Backend sends back {"token": "...", "email": "..."}
    const data = await response.json();

    return data; // Return {userId, message}
}

/**
 * @description Log out user from frontend
 * @returns 
 */
export async function userLogout()
{
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Logout failed");
    }

    return response.json();
}

/**
 * @description Delete user account
 * @returns
 */
export async function userDelete()
{
    const response = await fetch(`${BASE_URL}/auth/account`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Deletion failed");
    }

    return response.json();
}

/**
 * @description Change a user's password
 * @returns
 */
export async function changeUserPassword(currentPassword, newPassword)
{
    const response = await fetch(`${BASE_URL}/auth/password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({currentPassword, newPassword})
    });

    if (!response.ok)
    {
        throw new Error("Password change failed");
    }

    return response.json();
}

// ======================== PROFILE API FUNCTIONS =======================
// ======================================================================
/**
 * @description Get an individual user profile from backend
 * No params required. The user ID is retrieved from the token and credentials handles it
 * @returns User profile
 */
export async function getUserProfile()
{
    const response = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status === 404)
    {
        return {profile: null};
    }

    if (!response.ok)
    {
        throw new Error("Failed to retrieve profile information");
    }

    return response.json();
}

/**
 * @description Create an individual user profile
 * @param {object} profileData - Parts of profile user selects
 * @returns Created user profile
 */
export async function createUserProfile(profileData)
{
    const response = await fetch(`${BASE_URL}/profile`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
    });

    if (!response.ok)
    {
        throw new Error("Failed to create profile");
    }

    return response.json();
}

/**
 * @description Update a user profile
 * @param {object} updates - Information for properties to be updated
 * @returns Updated profile
 */
export async function updateUserProfile(updates)
{
    const response = await fetch(`${BASE_URL}/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({updates})
    });

    if (!response.ok)
    {
        throw new Error("Failed to update profile");
    }

    return response.json();
}

/**
 * @description Delete a user profile
 * No params required. The user ID is retrieved from the token and credentials handles it
 * @returns Deleted user profile
 */
export async function deleteUserProfile()
{
    const response = await fetch(`${BASE_URL}/profile`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete profile");
    }

    return response.json();
}

// ======================== LIBRARY API FUNCTIONS =======================
// ======================================================================

/**
 * @description Get all books from the user library
 * @param {object} filters - Filters containing params for search (only shelf, for now)
 * @returns Books in user library
 */
export async function getBooks(filters = {})
{
    const url = filters.shelf ? `${BASE_URL}/library/${filters.shelf}` : `${BASE_URL}/library`;

    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to fetch books");
    }

    return response.json();
}

/**
 * @description Add a new book to the user library
 * @param {object} bookData - Data for the book 
 * @returns New book in user library
 */
export async function addBook(bookData)
{
    const response = await fetch(`${BASE_URL}/library`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookData)
    });

    if(!response.ok)
    {
        throw new Error("Failed to add book");
    }

    return response.json();
}

/**
 * @description Update a book in the user library
 * @param {string} bookId - ID of book to be updated
 * @param {object} updates - Information for properties to be updated
 * @returns Updated book
 */
export async function updateBook(bookId, updates)
{
    const response = await fetch(`${BASE_URL}/library/${bookId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({updates})
    });

    if (!response.ok)
    {
        throw new Error("Failed to update book");
    }

    return response.json();
}

/**
 * @description Delete an individual book in the user library
 * @param {string} bookId - ID of book to be deleted
 * @returns Deleted book
 */
export async function deleteBook(bookId)
{
    const response = await fetch(`${BASE_URL}/library/${bookId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete book");
    }

    return response.json();
}

// ======================== SEARCH API FUNCTIONS =======================
// =====================================================================
/**
 * @description Search for books via Google Books API
 * @param {string} searchParam - Search via title, author or ISBN
 * @param {string} searchTerm - Specific detail according to searchParam
 * @returns Book search
 */
export async function searchBook(searchParam, searchTerm)
{
    const response = await fetch(`${BASE_URL}/books/search?searchParam=${searchParam}&searchTerm=${searchTerm}`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to search for book");
    }

    return response.json();
}

/**
 * @description Get a specific book from the database (already there)
 * @param {string} bookId - ID of book to be retrieved
 * @returns Requested book from database
 */
export async function getBookById(bookId)
{
    const response = await fetch(`${BASE_URL}/books/${bookId}`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to find book");
    }

    return response.json();
}

// ======================== GOAL API FUNCTIONS =======================
// ===================================================================

/**
 * @description Add a new goal to user data
 * @param {object} goalData - Specific data for goal
 * @returns New user goal
 */
export async function addUserGoal(goalData)
{
    const response = await fetch(`${BASE_URL}/goals`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(goalData) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to add new goal");
    }

    return response.json();
}

/**
 * @description Get all user goals from frontend
 * @returns All goals for user
 */
export async function getUserGoals()
{
    const response = await fetch(`${BASE_URL}/goals`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve goals");
    }

    return response.json();
}

/**
 * @description Get all user goals from frontend
 * @param {string} status - Status of user goal
 * @returns All goals for user
 */
export async function getUserGoalsByStatus(status)
{
    const response = await fetch(`${BASE_URL}/goals/goals-status?status=${status}`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error(`Failed to retrieve goals by ${status}`);
    }

    return response.json();
}

/**
 * @description Update a user goal
 * @param {string} goalId - Specific goal to update
 * @param {object} updates - Specific data to update goal
 * @returns Updated user goal
 */
export async function updateUserGoal(goalId, updates)
{
    const response = await fetch(`${BASE_URL}/goals`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({goalId, updates}) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to update goal");
    }

    return response.json();
}

/**
 * @description Delete an individual goal in user data
 * @param {string} goalId - ID of goal to be deleted
 * @returns Deleted goal
 */
export async function deleteUserGoal(goalId)
{
    const response = await fetch(`${BASE_URL}/goals`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({goalId}) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete goal");
    }

    return response.json();
}

// ======================== RECOMMENDATION API FUNCTIONS =======================
// =============================================================================
/**
 * @description Add a new recommendation to user data
 * @returns New user recommendation
 */
export async function addUserRecommendation()
{
    const response = await fetch(`${BASE_URL}/recommendations`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok)
    {
        throw new Error("Failed to add new recommendations");
    }

    return response.json();
}

/**
 * @description Get all user recommendations from frontend
 * @returns All recommendations for user
 */
export async function getAllUserRecommendations()
{
    const response = await fetch(`${BASE_URL}/recommendations`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve recommendations");
    }

    return response.json();
}

/**
 * @description Get all user recommendations from frontend
 * @returns All recommendations for user
 */
export async function getUserRecommendation(recommendationId)
{
    const response = await fetch(`${BASE_URL}/recommendations/${recommendationId}`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve recommendation");
    }

    return response.json();
}

/**
 * @description Update a user recommendation
 * @param {string} recommendationId - Specific recommendation to update
 * @param {string} status - Status for changing
 * @returns Updated user recommendation
 */
export async function updateUserRecommendation(recommendationId, status)
{
    const response = await fetch(`${BASE_URL}/recommendations/${recommendationId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status }) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to update recommendation");
    }

    return response.json();
}

/**
 * @description Delete an individual recommendations in user data
 * @param {string} recommendationId - ID of recommendation to be deleted
 * @returns Deleted recommendation
 */
export async function deleteUserRecommendation(recommendationId)
{
    const response = await fetch(`${BASE_URL}/recommendations/${recommendationId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete recommendation");
    }

    return response.json();
}

// ======================== PREFERENCES API FUNCTIONS =======================
// ==========================================================================
/**
 * @description Create user preferences (helps prompt AI)
 * @param {object} preferencesData - User preference information
 * @returns Created user preferences
 */
export async function createUserPreferences(preferencesData)
{
    const response = await fetch(`${BASE_URL}/preferences`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(preferencesData)
    });

    if (!response.ok)
    {
        throw new Error("Failed to create preferences");
    }

    return response.json();
}

/**
 * @description Get user preferences
 * @returns User preference object
 */
export async function getUserPreferences()
{
    const response = await fetch(`${BASE_URL}/preferences`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status === 404)
    {
        return {userPreferences: null};
    }

    if (!response.ok)
    {
        throw new Error("Failed to retrieve preferences");
    }

    return response.json();
}

/**
 * @description Update a user preferences
 * @param {object} updates - Specific data to update preferences
 * @returns Updated user preferences
 */
export async function updateUserPreferences(updates)
{
    const response = await fetch(`${BASE_URL}/preferences`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({updates}) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to update preferences");
    }

    return response.json();
}

/**
 * @description Delete user preferences
 * @returns Deleted user preferences
 */
export async function deleteUserPreferences()
{
    const response = await fetch(`${BASE_URL}/preferences`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete preferences");
    }

    return response.json();
}

// ======================== USER LANGUAGE API FUNCTIONS =======================
// ============================================================================
/**
 * @description Add a user language
 * @param {string} languageId - ID of added language from database
 * @returns Added language
 */
export async function addUserLanguage(languageId)
{
    const response = await fetch(`${BASE_URL}/user-languages`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ languageId })
    });

    if (!response.ok)
    {
        throw new Error("Failed to add language");
    }

    return response.json();
}

/**
 * @description Get all user languages
 * @returns All user languages
 */
export async function getUserLanguages()
{
    const response = await fetch(`${BASE_URL}/user-languages`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve languages");
    }

    return response.json();
}

/**
 * @description Delete user language
 * @param {string} languageId - ID of added language from database
 * @returns Deleted user language
 */
export async function deleteUserLanguage(languageId)
{
    const response = await fetch(`${BASE_URL}/user-languages`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ languageId }) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete language");
    }

    return response.json();
}

// ======================== USER GENRE API FUNCTIONS =======================
// =========================================================================
/**
 * @description Add a user genre
 * @param {string} genreId - ID of added genre from database
 * @returns Added genre
 */
export async function addUserGenre(genreId)
{
    const response = await fetch(`${BASE_URL}/user-genres`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ genreId })
    });

    if (!response.ok)
    {
        throw new Error("Failed to add genre");
    }

    return response.json();
}

/**
 * @description Get all user genres
 * @returns All user genres
 */
export async function getUserGenres()
{
    const response = await fetch(`${BASE_URL}/user-genres`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve genres");
    }

    return response.json();
}

/**
 * @description Delete user genre
 * @param {string} genreId - ID of added genre from database
 * @returns Deleted user genre
 */
export async function deleteUserGenre(genreId)
{
    const response = await fetch(`${BASE_URL}/user-genres`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ genreId }) 
    });

    if (!response.ok)
    {
        throw new Error("Failed to delete genre");
    }

    return response.json();
}

// ======================== LANGUAGES API FUNCTIONS =======================
// ========================================================================
/**
 * @description Get all available languages in the app
 * @returns All available languages
 */
export async function getAllLanguages()
{
    const response = await fetch(`${BASE_URL}/languages`, {
        method: "GET"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve languages");
    }

    return response.json();
}

// ======================== GENRES API FUNCTIONS =======================
// =====================================================================
/**
 * @description Get all available genres in the app
 * @returns All available genres
 */
export async function getAllGenres()
{
    const response = await fetch(`${BASE_URL}/genres`, {
        method: "GET"
    });

    if (!response.ok)
    {
        throw new Error("Failed to retrieve genres");
    }

    return response.json();
}