import {
    checkEmail,
    checkCredentials,
    checkToken,
    checkUsername,
    insertNewUser,
    saveSession,
    retrieveLocalToken,
    logoutUser,
} from './database/db-auth.js';
import { initUI } from './init-UI.js';
import { createMessage } from './utils/create-message.js';

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
    var publicPages = ['signup.html', 'login.html', 'index.html'];
    const path = window.location.pathname;

    for (var publicPage of publicPages) {
        if (path.includes(publicPage)) {
            console.log('Public Page');
            initUI(null);
            return;
        }
    }

    // The user is at a private page (dashboards, explore, etc.)
    console.log('Private Page');

    const retrieveLocalTokenMessage = retrieveLocalToken();

    if (retrieveLocalTokenMessage.success === false) {
        window.location.replace('/login.html');
        return;
    }

    const localToken = retrieveLocalTokenMessage.data.token;

    const checkTokenMessage = checkToken(localToken);

    if (checkTokenMessage.success === false) {
        window.location.replace('/login.html');
        return;
    }

    const isAdminPage = path.includes('/admin/');

    const role = checkTokenMessage.data.role;

    if (isAdminPage && role !== 'admin') {
        console.log('UNAUTHORIZED ACCESS TO ADMIN PAGES!');
        window.location.replace('/user/dashboard.html');
    }

    // Feed the UI with the user data
    initUI(checkTokenMessage.data);
}

checkAuth();
