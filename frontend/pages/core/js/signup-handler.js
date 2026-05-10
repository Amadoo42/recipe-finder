import { createMessage } from '/static/shared/utils/create-message.js';
import { createUserObject } from '/static/shared/utils/schema-factories.js';
import { API } from '/static/api/auth.js';

const signUpForm = document.getElementsByName('createUserForm')[0];
const api = new API();
api.setBase('/')

/**
 * @summary Handles the success/failure messages and displays it to the user
 * @param {Message} message The message object to display
 */
function handleCreationMessage(message) {
    alert(message.description);
}

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
        handleCreationMessage(createMessage(false, 'Passwords do not match!'));
        return;
    }

    // Create a user object using the factory function
    // Hash the password before creating the final user object to pass into the createUser function
    const newUserObject = createUserObject(
        userInput.firstName,
        userInput.lastName,
        userInput.username,
        userInput.email,
        userInput.password,
        userInput.userRole
    );

    console.log(newUserObject);

    // Pass the object into the createUser function and create the account
    const response = await api.request('signup_API/', 'POST', newUserObject);

    const message = await response.json();

    // Pass the message to the handler
    handleCreationMessage(message);

    if (message.success === true) {
        window.location.replace(message.data)
    }
}

if (signUpForm) {
    signUpForm.addEventListener('submit', onSubmit);
}
