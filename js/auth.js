import { checkEmail, checkToken, checkUsername, insertNewUser, saveSession } from "./database/db-client.js";


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
        - Validate data before passing on to the DB
    - return
        returns a message confirming success or describing the specific issue
*/

export async function createUser(newUserObject){
    
    // check Email Uniquness
    const mailCheckMessage = await checkEmail(newUserObject.email);

    if(mailCheckMessage.success === false){
        return mailCheckMessage;
    }

    // check Username Uniquness
    const usernameCheckMessage = await checkUsername(newUserObject.username);

    if(usernameCheckMessage.success === false){
        return usernameCheckMessage;
    }

    // Attempt to create the new account
    const accountCreationMessage = await insertNewUser(newUserObject);

    return accountCreationMessage;
}

function requestLogin(data){
    
}

function checkAuth() {

    // Check if the current page is a public page first
    // Public pages are ones that do not require a user to be logged in
    var publicPages = ['signup.html', 'login.html', 'index.html'];
    const path = window.location.pathname;
    
    for(var publicPage of publicPages){
        if(path.includes(publicPage)) 
        {
            console.log("Public Page");
            return;
        }
    }

    // The user is at a private page (dashboards, explore, etc.)
    console.log("Private Page");
}

checkAuth();
