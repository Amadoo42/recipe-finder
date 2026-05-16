/**
 * db-auth.js
 * Authentication and session management API.
 * Depends on: db-core.js
 */

import { createMessage } from '/static/shared/utils/create-message.js';
import { generateToken } from '/static/shared/utils/generate-token.js';
import { readTable, writeTable } from '/static/shared/database/db-core.js';

/**
 * Checks if an email is already in use.
 * @param {string} email - The email to check.
 * @returns {Object} - A message object indicating whether the email is unique or not.
 */
export function checkEmail(email) {
    const users = readTable('users') || [];
    for(let user of users) {
        if(user.email === email) {
            return createMessage(false, "This email is associated with an existing account!");
        }
    }
    return createMessage(true, "Email is unique");
}

/**
 * Checks if a username is already in use.
 * @param {string} username - The username to check.
 * @returns {Object} - A message object indicating whether the username is unique or not.
 */
export function checkUsername(username) {
    const users = readTable('users') || [];
    for(let user of users) {
        if(user.username === username) {
            return createMessage(false, "This username is associated with an existing account!");
        }
    }
    return createMessage(true, "Username is unique");
}

/**
 * Inserts a new user into the database.
 * @param {Object} newUserObject - The user object to insert. Should be created using the createUserObject function in schema-factories.js.
 * @returns {Object} - A message object indicating the result of the operation.
 */
export function insertNewUser(newUserObject) {
    try {
        const users = readTable('users') || [];
        users.push(newUserObject);
        writeTable('users', users);
        return createMessage(true, "Account successfully created!");
    } catch (error) {
        return createMessage(false, "Something went wrong! Could not create the new account.");
    }
}


/**
 * Checks if the provided username and hashed password are valid.
 * @param {string} username - The username to check.
 * @param {string} hashed_password - The hashed password to check.
 * @returns {Object} - A message object indicating the result of the check.
 */
export function verifyLogin(username, hashed_password) {
    const users = readTable('users') || [];
    let userIndex = -1;
    for(let i = 0; i < users.length; i++) {
        if(users[i].username === username && users[i].passwordHash === hashed_password) {
            userIndex = i;
            break;
        }
    }
    if(userIndex !== -1) {
        const token = generateToken();

        users[userIndex].token = token;
        writeTable('users', users);

        return createMessage(true, "The credentials are valid.", {
            token: token,
            role: users[userIndex].role,
        });
    }

    return createMessage(false, "The credentials you have provided are invalid!")
}

/**
 * Saves the session token to localStorage. 
 * @param {string} token - The session token to save.
 * @returns {Object} - A message object indicating the result of the operation.
 */
export function saveSession(token) {
    try {
        localStorage.setItem('session', token);
        return createMessage(true, "Session saved successfully!");
    } catch (error) {
        return createMessage(false, "Something went wrong! Could not save session.");
    }
}

/**
 * Checks if the provided session token is valid.
 * @param {string} token - The session token to check.
 * @returns {Object} - A message object indicating the result of the check.
 */
export function checkToken(userToken) {
    const users = readTable('users') || [];
    for(let user of users) {
        if(user.token === userToken) {
            let { passwordHash, token, ...userWithoutSensitiveInfo } = user; // exclude sensitive info from the returned user object
            return createMessage(true, "Session is valid", userWithoutSensitiveInfo);
        }
    }
    return createMessage(false, "The token is invalid or has expired!");
}

/**
 * Retrieves the local session token from localStorage.
 * @returns {Object} - A message object indicating the result of the operation.
 */
export function retrieveLocalToken() {
    const token = localStorage.getItem('session');
    if(token) {
        return createMessage(true, "Local token found.", { token: token });
    } else {
        return createMessage(false, "Found no local tokens.");
    }
}


/**
 * Logs out the current user by removing the session token from localStorage and clearing it from the user's record in the database.
 * @returns {Object} - A message object indicating the result of the operation.
 */
export function logoutUser() {
    let token = localStorage.getItem('session');
    if(token) {
        let users = readTable('users') || [];
        let userIndex = -1;
        for(let i = 0; i < users.length; i++) {
            if(users[i].token === token) {
                userIndex = i;
                break;
            }
        }
        if(userIndex !== -1) {
            users[userIndex].token = null;
            writeTable('users', users);
        }
        localStorage.removeItem('session');
        return createMessage(true, "Logout successful!");
    }    
    return createMessage(false, "No active session found.");
}