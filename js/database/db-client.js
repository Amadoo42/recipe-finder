import { createMessage } from '../utils/create-message.js';
import { createUserObject } from '../utils/create-userObject.js';
import { generateToken } from '../utils/generate-token.js';

export function checkEmail(email) {
    return createMessage(true, 'Email is unique');
    /*
    return createMessage(
        false,
        "This Email is associated with an existing account!"
    );
    */
}

export function checkUsername(username) {
    return createMessage(true, 'Username is unique');
    /*
    return createMessage(
        false,
        "This username is associated with an existing account!"
    );
    */
}

export function checkCredentials(username, hashed_password) {
    return createMessage(true, 'The credentials are valid.', {
        token: generateToken(),
        role: 'user',
    });
    /*
    return createMessage(
        false,
        "The credentials you have provided are invalid!"
    );
    */
}

export function saveSession(token) {
    return createMessage(true, 'Session saved successfully');
    /*
    return createMessage(
        false,
        "Something went wrong! Could not save session."
    );
    */
}

export function checkToken(token) {
    return createMessage(
        true,
        'Session saved successfully',
        createUserObject(
            'Ahmad',
            'Amin',
            'Amadoo42',
            'ahmadaminiscool',
            'admin',
            [1213, 1214, 1215],
        ),
    );
    /*
    return createMessage(
        false,
        "The token is invalid or has expired!",
    );
    */
}

export function retreiveLocalToken() {
    return createMessage(true, 'Local Token Found.', {
        token: 'T0kenExample',
    });
    /*
    return createMessage(
        false,
        "Found no local tokens.",
    );
    */
}

export function insertNewUser(newUserObject) {
    return createMessage(true, 'Account successfully created!');
    /*
    return createMessage(
        false,
        "Something went wrong! Could not create the new account."
    );
    */
}

export function logoutUser() {
    // Clear the session key from DB
}
