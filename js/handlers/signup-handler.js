import { createUser } from '../auth.js';
import { createMessage } from '../utils/create-message.js';
import { hash } from '../utils/hash.js';
import { createUserObject } from '../utils/schema-factories.js';
import { validation } from '../validation.js';
import { REDIRECT } from '../constants/auth-constants.js';
import { handleStatusMessage, clearMessage } from '/js/utils/error-message.js';

const signUpForm = document.getElementsByName('createUserForm')[0];

/**
 * @summary Handles the form submission for the sign-up process, including validation and user creation
 * @param {Event} event 
 */
async function onSubmit(event) {
    // Prevent page auto refreshing on submission
    event.preventDefault();

    // Scrape all form values at once
    const formData = new FormData(signUpForm);
    const userInput = Object.fromEntries(formData.entries());

    // Check the confirm field first
    const password = userInput.password;
    const confirmPassword = userInput.confirmPassword;

    if (password !== confirmPassword) {
        handleStatusMessage(createMessage(false, 'Passwords do not match!'));
        return;
    }
    console.log(userInput);

    const validationMessage = validation(userInput);

    if (validationMessage.success === false) {
        handleStatusMessage(validationMessage);
        return;
    }

    // Create a user object using the factory function
    // Hash the password before creating the final user object to pass into the createUser function
    const newUserObject = createUserObject(
        userInput.firstName,
        userInput.lastName,
        userInput.username,
        userInput.email,
        hash(userInput.password),
        userInput.userRole
    );

    // Pass the object into the createUser function and create the account
    const message = await createUser(newUserObject);

    // Pass the message to the handler
    handleStatusMessage(message);

    if (message.success === true) {
        REDIRECT.TO_LOGIN();
    }
}

if (signUpForm) {
    signUpForm.addEventListener('submit', onSubmit);
    signUpForm.addEventListener('reset', clearMessage);
}
