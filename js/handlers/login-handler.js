import { requestLogin } from '../auth.js';
import { createMessage } from '../utils/create-message.js';
import { hash } from '../utils/hash.js';

const loginForm = document.getElementById('loginForm');

function handleLoginMessage(message) {
    alert(message.description);
}

async function onSubmit(event) {
    // Prevent page auto refreshing on submission
    event.preventDefault();

    // Scrap form values

    // Check the confirm field first
    const userName = loginForm.elements['userName'].value;
    const password = loginForm.elements['password'].value;

    // Log the values for debugging
    console.log('USER REQUESTS ACCOUNT ACCESS WITH: ');
    console.log('username' + userName);
    console.log('password :' + password);

    // Pass the object into the createUser function and create the account
    const message = await requestLogin({
        username: userName,
        password: hash(password), // given the hashed version directly
    });

    if (message.success === false) {
        handleLoginMessage(message);
        return;
    }

    const role = message.data.role;

    // Redirect user correctly
    if (role === 'user') {
        window.location.replace('user/dashboard.html');
    } else if (role === 'admin') {
        window.location.replace('admin/dashboard.html');
    } else {
        handleLoginMessage(
            createMessage(false, 'Account is associated with borken role!'),
        );
        return;
    }

    // pass the message to the handler
    handleLoginMessage(message);
}

if (loginForm) {
    loginForm.addEventListener('submit', onSubmit);
}
