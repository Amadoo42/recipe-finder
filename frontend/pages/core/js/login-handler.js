import { API } from '/static/api/auth.js';

const loginForm = document.getElementsByName('loginUserForm')[0];
const api = new API();
api.setBase('/')

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

    // Pass the object into the createUser function and create the account
    const response = await api.request('login_API/', 'POST', userInput)

    const message = await response.json();

    // Could not Log in
    if (message.success == false) {
        handleLoginMessage(message)
        return;
    }

    if (message.success === true) {
        window.location.replace(message.data)
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', onSubmit);
}
