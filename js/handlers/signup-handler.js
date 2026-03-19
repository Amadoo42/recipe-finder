import { createUser } from '../auth.js';
import { createMessage } from '../utils/create-message.js';
import { hash } from '../utils/hash.js';
import { validation } from '../validation.js';

const signUpForm = document.getElementById('signUpForm');

function handleCreationMessage(message) {
    alert(message.description);
}

async function onSubmit(event) {
    // Prevent page auto refreshing on submission
    event.preventDefault();

    // Scrap form values

    // Check the confirm field first
    const password = signUpForm.elements['password'].value;
    const confirmPassword = signUpForm.elements['confirmPassword'].value;

    if (password !== confirmPassword) {
        handleCreationMessage(createMessage(false, 'Passwords do not match!'));
        return;
    }

    const firstName = signUpForm.elements['firstName'].value;
    const lastName = signUpForm.elements['lastName'].value;
    const userName = signUpForm.elements['userName'].value;
    const email = signUpForm.elements['email'].value;
    const role = signUpForm.elements['userRole'].value;

    // Log the values for debugging
    console.log('USER REQUESTS ACCOUNT CREATION WITH: ');
    console.log('firstName :' + firstName);
    console.log('lastName :' + lastName);
    console.log('userName' + userName);
    console.log('email :' + email);
    console.log('password :' + password);
    console.log('role' + role);

    var userObject = {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        email: email,
        password: password,
        role: role,
    };

    const validationMessage = validation(userObject);

    if (validationMessage.success === false) {
        handleCreationMessage(validationMessage);
        return;
    }

    userObject.password = hash(password); // given the hashed version directly

    // Pass the object into the createUser function and create the account
    const message = await createUser(userObject);

    // pass the message to the handler
    handleCreationMessage(message);

    if (message.success === true) {
        window.location.replace('login.html');
    }
}

if (signUpForm) {
    signUpForm.addEventListener('submit', onSubmit);
}
