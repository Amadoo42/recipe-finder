from core.services.Message import Message
import re

def validateName(name: str, label: str) -> Message:
    """
    Validates a name field.
    The function checks that the name is between 2 and 50 characters 
    and contains only alphabetic characters.
    """
    nameRegex = r"^[a-zA-Z]+$"
    if len(name) < 2 or len(name) > 50:
        return Message(
            False,
            f"{label} must be between 2 and 50 characters."
        )
    
    if  not re.match(nameRegex, name):
        return Message(
            False,
            f"{label} must contain only alphabetic characters."
        )
    
    return Message(True, "Valid name.")


def validateEmail(email: str) -> Message:
    """
    Validates an email address.
    The function checks that the email is in a valid format and does 
    not exceed 100 characters in length.
    """
    emailRegex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if len(email) > 100:
        return Message(
            False,
            "Email must not exceed 100 characters."
        )
    
    if  not re.match(emailRegex, email):
        return Message(
            False,
            "Please enter a valid email address (user@domain.com)."
        )
    
    return Message(True, "Valid email.")

def validateUsername(username: str) -> Message:
    """
    Validates a username.
    The function checks that the username is between 4 and 20 characters, 
    starts with a letter, and contains only alphanumeric characters and underscores.
    """
    # Alphanumeric, no spaces, starts with a letter, 4-20 chars
    userRegex = r"^[a-zA-Z][a-zA-Z0-9_]+$"
    if len(username) < 4 or len(username) > 20:
        return Message(
            False,
            "Username must be between 4 and 20 characters."
        )
    
    if  not re.match(userRegex,username):
        return Message(
            False,
            "Username must start with a letter and can only contain letters, numbers, and underscores."
        )
    
    return Message(True, "Valid username.")



def validatePassword(password: str) -> Message:
    """
    Validates a password.
    The function checks that the password is between 8 and 128 characters.
    """
    if  len(password) < 8 or len(password) > 128:
        return Message(
            False,
            "Password must be between 8 and 128 characters."
        )
    
    return Message(True, "Valid password.")


def validateRole(role: str) -> Message:
    """
    Validates an account role.
    The function checks that the role is one of the valid options ('user' or 'admin').
    """
    validRoles = ['user', 'admin']
    if not role in validRoles:
        return Message(False, "Invalid account role selected.")
    
    return Message(True, "Valid role.")


def validation(userObject: dict) -> Message:
    """
    Validates a user dictionary data values sequentially.
    The function runs all validation checks and returns the first failure found.
    """
    # Run all checks in sequence
    checks = [
        validateName(userObject.get('first_name'), "First Name"),
        validateName(userObject.get('last_name'), "Last Name"),
        validateUsername(userObject.get('username')),
        validateEmail(userObject.get('email')),
        validatePassword(userObject.get('password')),
        validateRole(userObject.get('role'))
    ]

    # Find the first failure
    for result in checks:
        if result.success == False:
            return result

    return Message(True, "All data constraints passed.")