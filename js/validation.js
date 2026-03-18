import { createMessage } from "./utils/create-message.js";

/*

    Constraints on data:

    Data         Length         Format/Pattern
            
    firstName    2-50 chars     Alpha only
    lastName     2-50 chars     Alpha only
    username     4-20 chars     Alphanumeric/Nospaces/First char alpha
    email        Max 100 chars  Must follow user@domain.com
    password     8-128 chars    -
    role         N/A            Must be in ['user', 'admin']
    
*/

// Validate FirstName & LastName
function validateName(name, label) {
    const nameRegex = /^[a-zA-Z\s]+$/;
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
            "Username must be alphanumeric and start with a letter."
        );
    }
    return createMessage(true, "Valid username.");
}

function validatePassword(password) {
    if (password.length < 8 || password.length > 128) {
        return createMessage(
            false, 
            "Password must be between 8 and 128 characters."
        );
    }
    return createMessage(true, "Valid password.");
}

function validateRole(role) {
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
        return createMessage(false, "Invalid account role selected.");
    }
    return createMessage(true, "Valid role.");
}

export function validation(userObject) {
    // Run all checks in sequence
    const checks = [
        validateName(userObject.firstName, "First Name"),
        validateName(userObject.lastName, "Last Name"),
        validateUsername(userObject.username),
        validateEmail(userObject.email),
        validatePassword(userObject.password),
        validateRole(userObject.role)
    ];

    // Find the first failure
    for (const result of checks) {
        if (result.success === false) {
            return result;
        }
    }

    return createMessage(true, "All data constraints passed.");
}