import DOMPurify from 'dompurify';

/**
 * Sanitizes a string to prevent XSS attacks.
 * @param {string} dirty - The raw input string.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (dirty) => {
    if (typeof dirty !== 'string') return '';
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: []  // Strip all attributes
    });
};

/**
 * Validates an email address.
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};
