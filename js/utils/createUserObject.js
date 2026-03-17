export function createUserObject(firstName, lastName, username, email, password, role = 'user') {
    return {
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: role,
        savedRecipes: [] // Useful for later when users save recipes (includes recipe ID)
    };
}