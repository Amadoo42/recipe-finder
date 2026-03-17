import { createUser } from "./auth.js";
import { createMessage } from "./utils/Create Message Object.js";
import { hash } from "./utils/hash.js";


const signupForm = document.getElementById('signupForm');

function handleCreationOutput(message){

}

async function onSubmit(event){
    
    // Prevent page auto refreshing on submission
    event.preventDefault();

    // Scrap form values
    
    // Check the confirm field first
    const password = signupForm.elements['password'].value;
    const confirmPassword = signupForm.elements['confirm_password'].value;

    if(password !== confirmPassword){
        handleCreationOutput(createMessage(
            false,
            "Passwords do not match!"
        ))
        return;
    }

    const firstName = signupForm.elements['first_name'].value;
    const lastName = signupForm.elements['last_name'].value;
    const userName = signupForm.elements['user_name'].value;
    const email = signupForm.elements['email'].value;
    const role = signupForm.elements['user_role'].value;

    // Log the values for debugging
    console.log("USER REQUESTS ACCOUNT CREATION WITH: ");
    console.log("firstName :" + firstName);
    console.log("lastName :" + lastName);
    console.log("userName" + userName);
    console.log("email :" + email);
    console.log("password :" + password);
    console.log("role" + role);

    
    // Pass the object into the createUser function and create the account
    const message = await createUser({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: hash(password),   // given the hashed version directly
        role: role
    });

    // pass the message to the handler
    handleCreationOutput(message);
}

if(signupForm){
    signupForm.addEventListener('submit', onSubmit);
}