/**
 * This file contains a sanitiser to add safety to user input
 * Though XSS, SQL injection and input validation is handled on the backend,
 * frontend sanitisation/validation helps prevent bad input even
 * reaching the backend
 */

/**
 * @description Sanitiser to prevent bad input from frontend
 * @param {string} stringInput - Variable string
 * @returns {string} - Sanitized string 
 */
export function stripHtml(stringInput)
{
    // If input is empty, just return it as is
    if (!stringInput)
    {
        return stringInput;
    }
    // Sanitise string
    return stringInput.replace(/<[^>]*>/g, '');
}