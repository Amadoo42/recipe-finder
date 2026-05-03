import { requestLogin } from '../auth.js';
import { createMessage } from '../utils/create-message.js';
import { hash } from '../utils/hash.js';
import { PAGE_AUTH_LEVEL, REDIRECT } from '../constants/auth-constants.js';
import { handleStatusMessage, clearMessage } from '/js/utils/error-message.js';

const loginForm = document.getElementsByName('loginUserForm')[0];

/**
 * @summary Handles the form submission for the login process, including validation and redirection based on user role
 * @param {Event} event 
 */
async function onSubmit(event) {
    // Prevent page auto refreshing on submission
    event.preventDefault();

    // Scrape all form values at once
    const formData = new FormData(loginForm);
    const userInput = Object.fromEntries(formData.entries());

    // Check the confirm field first
    const username = userInput.username;
    const password = userInput.password;

    // Pass the object into the createUser function and create the account
    const loginMessage = await requestLogin({
        username: username,
        password: hash(password), // given the hashed version directly
    });

    if (loginMessage.success === false) {
        handleStatusMessage(loginMessage);
        return;
    }

    const role = loginMessage.data.role;

    // Redirect user correctly
    if (role === PAGE_AUTH_LEVEL.USER) {
        REDIRECT.TO_USER();
    } else if (role === PAGE_AUTH_LEVEL.ADMIN) {
        REDIRECT.TO_ADMIN();
    } else {
        handleStatusMessage(
            createMessage(false, 'Account is associated with broken role!'),
        );
        return;
    }

    // pass the message to the handler
    handleStatusMessage(loginMessage);
}

if (loginForm) {
    loginForm.addEventListener('submit', onSubmit);
    loginForm.addEventListener('reset', clearMessage);
}
