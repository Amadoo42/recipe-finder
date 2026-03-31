# Database API Reference

This document maps out the core functions available in the `js/database/` directory. Front-end handlers (`js/handlers/`) should call these functions instead of interacting with `localStorage` directly.

## Authentication (`db-auth.js`)

### `checkEmail(email)`
* **Behavior:** Iterates through the users table to verify if the email is already registered.
* **Returns:** `MessageObject` indicating uniqueness.

### `checkUsername(username)`
* **Behavior:** Verifies if the username is taken.
* **Returns:** `MessageObject` indicating uniqueness.

### `insertNewUser(newUserObject)`
* **Input:** Object matching the `UserObject` schema.
* **Behavior:** Appends a new user object to the users array and updates storage.
* **Returns:** `MessageObject`

### `verifyLogin(username, hashed_password)`
* **Behavior:** Validates credentials against DB. If successful, generates a session token.
* **Returns:** `MessageObject` containing the token and user role.

### `saveSession(token)`
* **Behavior:** Persists the session token to the browser's local storage.
* **Returns:** `MessageObject`

### `checkToken(userToken)`
* **Behavior:** Validates if the provided token exists in the DB.
* **Returns:** `MessageObject` containing the associated account details.

### `retrieveLocalToken()`
* **Behavior:** Retrieves the stored session token from `localStorage` to validate if a user is logged in.
* **Returns:** `MessageObject` containing the token.

### `logoutUser()`
* **Behavior:** Clears the session token from localStorage and user record.
* **Returns:** `MessageObject`

## Recipe Management (`db-recipes.js`)

### `getRecipes()`
* **Behavior:** Retrieves all recipes from the database.
* **Returns:** Array of recipe objects.

### `getRecipeById(recipeId)`
* **Returns:** The specific recipe object or null.

### `addRecipe(recipe)`
* **Behavior:** Auto-increments the ID, appends to recipes array, and saves.
* **Returns:** `MessageObject` containing the new recipe payload.

### `updateRecipe(recipeId, updatedRecipe)`
* **Behavior:** Overwrites existing recipe data.
* **Returns:** `MessageObject`

### `deleteRecipe(recipeId)`
* **Behavior:** Removes the recipe from the database.
* **Returns:** `MessageObject`

### `searchRecipes(queryText, courseFilter)`
* **Behavior:** Filters recipes by query text and course category.
* **Returns:** Array of matching recipe objects.

## User Actions (`db-user.js`)

### `toggleFavourite(recipeId)`
* **Behavior:** Adds or removes a recipe ID from the user's saved list.
* **Returns:** `MessageObject`

### `getUserFavourites()`
* **Behavior:** Maps saved IDs to actual recipe objects for the active user.
* **Returns:** `MessageObject` containing the list of recipes.
