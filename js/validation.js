import { createMessage } from "./utils/create-message.js";

/**
 * @typedef {Object} userInput
 * @property {string} firstName - 2-50 chars | Alpha only
 * @property {string} lastName - 2-50 chars | Alpha only
 * @property {string} username - 4-20 chars | Alphanumeric and underscores (Starts with Alpha, no spaces)
 * @property {string} email - Max 100 chars | Format: user@domain.com
 * @property {string} password - 8-128 chars | Plain text
 * @property {string} role - Must be 'user' or 'admin'
 */


/**
 * @summary Validates a name field.
 * @description The function checks that the name is between 2 and 50 characters and contains only alphabetic characters and spaces.
 * @param {string} name - The name to validate.
 * @param {string} label - The label for the name field.
 * @returns {Message} - The validation result.
 */
function validateName(name, label) {
    const nameRegex = /^[a-zA-Z]+$/;
    if (name.length < 2 || name.length > 50) {
        return createMessage(
            false,
            `${label} must be between 2 and 50 characters.`
        );
    }
    if (!nameRegex.test(name)) {
        return createMessage(
            false,
            `${label} must contain only alphabetic characters.`
        );
    }
    return createMessage(true, "Valid name.");
}

/**
 * @summary Validates an email address.
 * @description The function checks that the email is in a valid format and does not exceed 100 characters in length and in the format 'user@domain.com'.
 * @param {string} email - The email address to validate.
 * @returns {Message} - The validation result.
 */
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.length > 100) {
        return createMessage(
            false,
            "Email must not exceed 100 characters."
        );
    }
    if (!emailRegex.test(email)) {
        return createMessage(
            false,
            "Please enter a valid email address (user@domain.com)."
        );
    }
    return createMessage(true, "Valid email.");
}

/**
 * @summary Validates a username.
 * @description The function checks that the username is between 4 and 20 characters, starts with a letter, and contains only alphanumeric characters and underscores.
 * @param {string} username - The username to validate.
 * @returns {Message} - The validation result.
 */
function validateUsername(username) {
    // Alphanumeric, no spaces, starts with a letter, 4-20 chars
    const userRegex = /^[a-zA-Z][a-zA-Z0-9_]+$/;
    if (username.length < 4 || username.length > 20) {
        return createMessage(
            false,
            "Username must be between 4 and 20 characters."
        );
    }
    if (!userRegex.test(username)) {
        return createMessage(
            false,
            "Username must start with a letter and can only contain letters, numbers, and underscores."
        );
    }
    return createMessage(true, "Valid username.");
}

/**
 * @summary Validates a password.
 * @description The function checks that the password is between 8 and 128 characters.
 * @param {string} password - The password to validate.
 * @returns {Message} - The validation result.
 */
function validatePassword(password) {
    if (password.length < 8 || password.length > 128) {
        return createMessage(
            false,
            "Password must be between 8 and 128 characters."
        );
    }
    return createMessage(true, "Valid password.");
}

/**
 * @summary Validates an account role.
 * @description The function checks that the role is one of the valid options.
 * @param {string} role - The role to validate.
 * @returns {Message} - The validation result.
 */
function validateRole(role) {
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
        return createMessage(false, "Invalid account role selected.");
    }
    return createMessage(true, "Valid role.");
}

/**
 * @summary Validates a user object data values sequentially.
 * @description The function runs all validation checks on the provided user object.
 * @param {Object} userObject - The user object to validate.
 * @returns {Message} - The validation result message.
 */
export function validation(userObject) {
    // Run all checks in sequence
    const checks = [
        validateName(userObject.firstName, "First Name"),
        validateName(userObject.lastName, "Last Name"),
        validateUsername(userObject.username),
        validateEmail(userObject.email),
        validatePassword(userObject.password),
        validateRole(userObject.userRole)
    ];

    // Find the first failure
    for (const result of checks) {
        if (result.success === false) {
            return result;
        }
    }

    return createMessage(true, "All data constraints passed.");
}
