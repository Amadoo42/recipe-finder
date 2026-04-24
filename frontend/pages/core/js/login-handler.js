import { requestLogin } from '/static/api/auth.js';
import { createMessage } from '/static/shared/utils/create-message.js';
import { hash } from '/static/shared/utils/hash.js';
import { PAGE_AUTH_LEVEL, REDIRECT } from '/static/constants/auth-constants.js';

const loginForm = document.getElementsByName('loginUserForm')[0];

/**
 * @summary Handles the success/failure messages and displays it to the user
 * @param {Message} message The message object to display
 */
function handleLoginMessage(message) {
    alert(message.description);
}

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
        handleLoginMessage(loginMessage);
        return;
    }

    const role = loginMessage.data.role;

    // Redirect user correctly
    if (role === PAGE_AUTH_LEVEL.USER) {
        REDIRECT.TO_USER();
    } else if (role === PAGE_AUTH_LEVEL.ADMIN) {
        REDIRECT.TO_ADMIN();
    } else {
        handleLoginMessage(
            createMessage(false, 'Account is associated with broken role!'),
        );
        return;
    }

    // pass the message to the handler
    handleLoginMessage(loginMessage);
}

if (loginForm) {
    loginForm.addEventListener('submit', onSubmit);
}
