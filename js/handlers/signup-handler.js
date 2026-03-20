import { createUser } from '../auth.js';
import { createMessage } from '../utils/create-message.js';
import { hash } from '../utils/hash.js';
import { createUserObject } from '../utils/schema-factories.js';
import { validation } from '../validation.js';

const signupForm = document.getElementById('signupForm');

function handleCreationMessage(message) {
    alert(message.description);
}

async function onSubmit(event) {
    // Prevent page auto refreshing on submission
    event.preventDefault();

    // Scrap form values

    // Check the confirm field first
    const password = signupForm.elements['password'].value;
    const confirmPassword = signupForm.elements['confirm_password'].value;

    if (password !== confirmPassword) {
        handleCreationMessage(createMessage(false, 'Passwords do not match!'));
        return;
    }

    const firstName = signupForm.elements['first_name'].value;
    const lastName = signupForm.elements['last_name'].value;
    const userName = signupForm.elements['user_name'].value;
    const email = signupForm.elements['email'].value;
    const role = signupForm.elements['user_role'].value;

    // Log the values for debugging
    console.log('USER REQUESTS ACCOUNT CREATION WITH: ');
    console.log('firstName :' + firstName);
    console.log('lastName :' + lastName);
    console.log('userName' + userName);
    console.log('email :' + email);
    console.log('password :' + password);
    console.log('role' + role);

    /** First we create a user object with the raw values (including the unhashed password) to pass into the validation function.
     * This is because the validation function needs to check the password's length which requires access to the raw password value.
     */
    var validationObject = createUserObject(firstName, lastName, userName, email, password, role);
    
    const validationMessage = validation(validationObject);

    if (validationMessage.success === false) {
        handleCreationMessage(validationMessage);
        return;
    }

    var userObject = createUserObject(firstName, lastName, userName, email, hash(password), role);

    // Pass the object into the createUser function and create the account
    const message = await createUser(userObject);

    // pass the message to the handler
    handleCreationMessage(message);

    if (message.success === true) {
        window.location.replace('login.html');
    }
}

if (signupForm) {
    signupForm.addEventListener('submit', onSubmit);
}
