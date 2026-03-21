import {
    checkEmail,
    checkCredentials,
    checkToken,
    checkUsername,
    insertNewUser,
    saveSession,
    retreiveLocalToken,
    logoutUser,
} from './database/db-client.js';
import { initUI } from './init-UI.js';
import { createMessage } from './utils/create-message.js';
import { PAGE_AUTH_LEVEL, REDIRECT } from './constants/auth-constants.js';

/*

createUser(data) function:
    - Attempts to create a new user using the provided newUser structure
    - Expects the input in the form of:
    {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password, // hashed password
        role: role
    }
    - Purpose:
        - Check Uniquness of
            - Email
            - Username
    - return
        returns a message confirming success or describing the specific issue

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

/*

requestLogin(data) function:
    - Attempts to log in a user using the provided user structure
    - Expects the input in the form of:
    {
        userName: userName,
        password: password // hashed password
    }
    - Purpose:
        - Query the database to confirm user credentials
    - return
        returns a message confirming success/refusing access 
        
*/
export async function requestLogin(userObject) {
    // Check the password correctness
    const checkCredentialsMessage = await checkCredentials(
        userObject.username,
        userObject.password,
    );

    if (checkCredentialsMessage.success === false) {
        return checkCredentialsMessage;
    }

    const sessionObject = checkCredentialsMessage.data;

    // Attempt to save the new token locally
    const saveSessionMessage = await saveSession(sessionObject.token);

    if (saveSessionMessage.success === false) {
        return saveSessionMessage;
    }

    return createMessage(true, 'Log in was successful!', {
        role: sessionObject.role,
    });
}

export function logout() {
    logoutUser();
    console.log('User logged out');
}

function checkAuth() {

    // Check if the current page is a public page first
    // Public pages are ones that do not require a user to be logged in
    const authLevel = document.documentElement.dataset.authLevel ?? PAGE_AUTH_LEVEL.PRIVATE;
    console.log("auth level: " + authLevel);

    if (authLevel === PAGE_AUTH_LEVEL.PUBLIC) {
        console.log('Public Page');
        initUI(null);
        return;
    }

    // The user is at a private page (dashboards, explore, etc.)
    console.log('Private Page');

    const retreiveLocalTokenMessage = retreiveLocalToken();

    if (retreiveLocalTokenMessage.success === false) {
        REDIRECT.TO_LOGIN();
        return;
    }

    const localToken = retreiveLocalTokenMessage.data.token;

    const checkTokenMessage = checkToken(localToken);

    if (checkTokenMessage.success === false) {
        REDIRECT.TO_LOGIN();
        return;
    }

    const isAdminPage = authLevel === PAGE_AUTH_LEVEL.ADMIN;

    const role = checkTokenMessage.data.role;

    console.log("ROLE : " + role);

    if (![PAGE_AUTH_LEVEL.USER, PAGE_AUTH_LEVEL.ADMIN].includes(role)) {
        console.log('UNAUTHORIZED ACCESS TO PRIVATE PAGES!');
        REDIRECT.TO_LOGIN();
        return;
    }

    if (isAdminPage && role !== PAGE_AUTH_LEVEL.ADMIN) {
        console.log('UNAUTHORIZED ACCESS TO ADMIN PAGES!');
        REDIRECT.TO_USER();
        return;
    }

    // Feed the UI with the user data
    initUI(checkTokenMessage.data);
}

checkAuth();
