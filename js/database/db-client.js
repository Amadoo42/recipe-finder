import { createMessage } from "../utils/Create Message Object";
import { createUserObject } from "../utils/createUserObject";

export function checkEmail(email){
    return createMessage(
        success=true,
        description="Email is unique"
    );
    /*
    return createMessage(
        success=false,
        description="This Email is associated with an existing account!"
    );
    */
}

export function checkUsername(username){
    return createMessage(
        success=true,
        description="Username is unique"
    );
        /*
    return createMessage(
        success=false,
        description="This username is associated with an existing account!"
    );
    */
}

export function checkPassword(username, hashed_password){
    return createMessage(
        success=true,
        description="Correct Password"
    );
    /*
    return createMessage(
        success=false,
        description="The credentials you have provided are invalid!"
    );
    */
}

export function saveSession(username, token, expiresAt){
    return createMessage(
        success=true,
        description="Session saved successfully"
    );
    /*
    return createMessage(
        success=false,
        description="Something went wrong! Could not save session."
    );
    */
}

export function checkToken(token){
    return createMessage(
        success=true,
        description="Session saved successfully",
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
        success=false,
        description="The token is invalid or has expired!",
    );
    */
}

export function insertNewUser(newUserObject){
    return createMessage(
        success=true,
        description="Account successfully created!"
    );
    /*
    return createMessage(
        success=false,
        description="Something went wrong! Could not create the new account."
    );
    */
}