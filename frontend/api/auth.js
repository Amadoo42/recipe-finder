import {
    checkEmail,
    verifyLogin,
    checkToken,
    checkUsername,
    insertNewUser,
    saveSession,
    retrieveLocalToken,
    logoutUser,
} from '/static/shared/database/db-auth.js';

import { initUI } from '/static/shared/js/init-UI.js';
import { createMessage } from '/static/shared/utils/create-message.js';

import { PAGE_AUTH_LEVEL, REDIRECT } from "/static/constants/auth-constants.js";

import { isDevActive } from '/static/shared/utils/dev-mode.js';

/**
 * @typedef {Object} NewUser
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} username - A unique display name for the account.
 * @property {string} email - A unique email address.
 * @property {string} passwordHash - The hashed password string.
 * @property {string} role - The user's permission level (e.g., 'admin', 'user').
 */

/**
 * @typedef {Object} User
 * @property {string} username - A unique display name for the account.
 * @property {string} password - The hashed password string.
 */

/**
 * @typedef {Object} UserWithoutSensitiveInfo
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} username - A unique display name for the account.
 * @property {string} email - A unique email address.
 * @property {string} role - The user's permission level (e.g., 'admin', 'user').
 */

/**
 * @summary Attempts to create a new user using the provided newUser structure
 * @description The function performs the following steps:
 * 1. Checks if the provided email is unique in the database.
 * 2. Checks if the provided username is unique in the database.
 * 3. If both checks pass, it attempts to insert the new user into the database.
 * 4. Returns a message confirming the success or failure of the account creation process.
 * @param {NewUser} newUserObject - The new user data
 * @returns a message confirming success/failure of account creation
 */
export async function createUser(newUserObject) {
    // check Email Uniquness
    const mailCheckMessage = await checkEmail(newUserObject.email);

    if (mailCheckMessage.success === false) {
        return mailCheckMessage;
    }

    // check Username Uniquness
    const usernameCheckMessage = await checkUsername(newUserObject.username);

    if (usernameCheckMessage.success === false) {
        return usernameCheckMessage;
    }

    // Attempt to create the new account
    const accountCreationMessage = await insertNewUser(newUserObject);

    return accountCreationMessage;
}

/**
 * @summary Attempts to log in a user using the provided user structure
 * @param {User} userObject - The user data for login 
 * @description The function performs the following steps:
 * 1. Checks the provided username and password against the database records.
 * 2. If the credentials are valid, it retrieves the user's session information.
 * 3. Attempts to save the session token locally for future authentication.
 * 4. Returns a message confirming the success or failure of the login attempt, along with user role information if successful.
 * @returns a message confirming success/refusing access
 */
export async function requestLogin(userObject) {
    // Check the password correctness
    const verifyLoginMessage = await verifyLogin(
        userObject.username,
        userObject.password,
    );

    if (verifyLoginMessage.success === false) {
        return verifyLoginMessage;
    }

    const sessionObject = verifyLoginMessage.data;

    // Attempt to save the new token locally
    const saveSessionMessage = await saveSession(sessionObject.token);

    if (saveSessionMessage.success === false) {
        return saveSessionMessage;
    }

    return createMessage(true, 'Log in was successful!', {
        role: sessionObject.role,
    });
}

/**
 * @summary Logs out the current user by clearing their session information
 * @description The function performs the following steps:
 * 1. Query the database to invalidate the current session token.
 * 2. Clear any locally stored session information to ensure the user is fully logged out.
 * @returns {void}
 */
export function logout() {
    logoutUser();
    console.log('User logged out');
}

/**
 * @summary Checks if the application is in development mode and allows bypassing authentication for testing purposes
 * @returns {boolean} returns true if in development mode, allowing bypass; otherwise, returns false to enforce normal authentication flow
 */
function devModeLogin() {
    if (isDevActive()) {
        console.log("CAUTION: DEV MODE ACTIVE");
        console.log("DISABLE DEV MODE FROM index.html");
        return true;
    }
    return false;
}


/**
 * @summary Retrieves the user object associated with the local session token, if valid
 * @returns {UserWithoutSensitiveInfo|null} the user object if a valid session exists; otherwise, null
 */
function getUserObjectFromLocalToken() {
    const retrieveLocalTokenMessage = retrieveLocalToken();

    if (retrieveLocalTokenMessage.success === false) {
        return null;
    }

    const localToken = retrieveLocalTokenMessage.data.token;

    const checkTokenMessage = checkToken(localToken);

    if (checkTokenMessage.success === false) {
        return null;
    }

    const userObject = checkTokenMessage.data;

    console.log("ROLE : " + userObject.role);

    return userObject;
}
/**
 * @summary strategy map for page autherization.
 *
 */
const ACCESS_POLICIES = {
    // always allow access to public pages
    [PAGE_AUTH_LEVEL.PUBLIC]: (role) => {
        console.log("Public Page: No Authentication Required");
        return true;
    },
    // only allow access to admin pages for users with admin role
    [PAGE_AUTH_LEVEL.PRIVATE]: (role) => {
        console.log('Private Page: User Page');
        return [PAGE_AUTH_LEVEL.USER, PAGE_AUTH_LEVEL.ADMIN].includes(role);
    },
    // allow access to private pages for logged in clients
    [PAGE_AUTH_LEVEL.ADMIN]: (role) => {
        console.log('Private Page: Admin Page');
        return role === PAGE_AUTH_LEVEL.ADMIN;
    }
};

/**
 * @summary Validates the user's access to a specific page based on their role and the page's authentication requirements
 * @param {string} role - The role of the authenticated user
 * @param {string} requiredAuthLevel - The authentication level required for the page
 * @returns {boolean} - True if the user has access; otherwise, false
 */
function validateAccess(role, requiredAuthLevel) {
    const policy = ACCESS_POLICIES[requiredAuthLevel];
    // if the requiredAuthLevel is not recognized, deny access by default
    if (!policy)
        return false;

    return policy(role);
}

/**
 * @summary Retrieves the authentication level required for the current page from the HTML data attributes
 * @returns {string} The authentication level required for the current page.
 */
function getAuthLevel() {
    // Default to private if the auth level is not specified in the HTML
    const authLevel = document.documentElement.dataset.authLevel ?? PAGE_AUTH_LEVEL.PRIVATE;
    console.log("Auth level: " + authLevel);
    return authLevel;
}

/**
 * @summary Checks the user's authentication status and initializes the UI accordingly
 * @description The function performs the following steps:
 * 1. Checks if the application is in development mode, allowing for an authentication bypass for testing purposes.
 * 2. Retrieves the required authentication level for the current page.
 * 3. If the page is public, it initializes the UI without requiring authentication.
 * 4. If the page is not public, it attempts to retrieve the user object from the local session token.
 * 5. If no valid user session exists, it redirects the user to the login page.
 * 6. If a valid user session exists but the user does not have the required permissions, it redirects the user to the user dashboard.
 * 7. If the user has the required permissions, it initializes the UI with the user's information.
 * @returns {void}
 */
function checkAuth() {

    // Check if in dev mode for testing (Dev bypass)
    if (devModeLogin()) {
        initUI(null);
        return;
    }

    const requiredAuthLevel = getAuthLevel();

    // Check if the page is public (Public bypass)
    if (requiredAuthLevel === PAGE_AUTH_LEVEL.PUBLIC) {
        console.log("Public page: No authentication required");
        initUI(null);
        return;
    }

    const userObject = getUserObjectFromLocalToken();

    // If the user is not authenticated redirect to the login page
    if (userObject === null) {
        REDIRECT.TO_LOGIN();
        return;
    }

    // If the user doesn't have the required permissions, redirect to the dashboard
    // If the user was trying to access an admin page, but is not an admin, redirect to the user dashboard
    // If the user was trying to access a user page, but is not logged in, redirect to the login page (handled by getUserObjectFromLocalToken)
    if (!validateAccess(userObject.role, requiredAuthLevel)) {
        REDIRECT.TO_USER();
        return;
    }

    // Feed the UI with the user data
    initUI(userObject);
}

checkAuth();
