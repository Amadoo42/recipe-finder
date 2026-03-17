import { createMessage } from "../utils/create-message.js";
import { createUserObject } from "../utils/create-userObject.js";

export function checkEmail(email){
    return createMessage(
        true,
        "Email is unique"
    );
    /*
    return createMessage(
        false,
        "This Email is associated with an existing account!"
    );
    */
}

export function checkUsername(username){
    return createMessage(
        true,
        "Username is unique"
    );
        /*
    return createMessage(
        false,
        "This username is associated with an existing account!"
    );
    */
}

export function checkPassword(username, hashed_password){
    return createMessage(
        true,
        "Correct Password"
    );
    /*
    return createMessage(
        false,
        "The credentials you have provided are invalid!"
    );
    */
}

export function saveSession(username, token, expiresAt){
    return createMessage(
        true,
        "Session saved successfully"
    );
    /*
    return createMessage(
        false,
        "Something went wrong! Could not save session."
    );
    */
}

export function checkToken(token){
    return createMessage(
        true,
        "Session saved successfully",
        createUserObject(
            "Ahmad",
            "Amin",
            "Amadoo42",
            "amadoo@amin.com",
            "ahmadaminiscool",
            "admin",
            [1213, 1214, 1215]
        )
    );
    /*
    return createMessage(
        false,
        "The token is invalid or has expired!",
    );
    */
}

export function insertNewUser(newUserObject){
    return createMessage(
        true,
        "Account successfully created!"
    );
    /*
    return createMessage(
        false,
        "Something went wrong! Could not create the new account."
    );
    */
}