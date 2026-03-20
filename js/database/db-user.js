/**
 * db-user.js
 * User-specific interactions (favourites logic only for now).
 * Depends on: db-core.js, db-auth.js, db-recipes.js
 */

import { readTable, writeTable } from './db-core.js';
import { createMessage } from '../utils/create-message.js'
import { retrieveLocalToken } from './db-auth.js';
import { getRecipes } from './db-recipes.js';

/**
 * Toggles the favourite status of a recipe for the authenticated user.
 * If the recipe is already in the user's savedRecipes list, it will be removed; otherwise, it will be added.
 * @param { string } recipeId - The ID of the recipe to toggle as a favourite.
 * @returns { Object } A message object indicating success or failure of the operation.
 */
export function toggleFavourite(recipeId) {
    let sessionTokenObject = retrieveLocalToken();
    if(sessionTokenObject.success === false) {
        return createMessage(false, 'User not authenticated');
    }
    let sessionToken = sessionTokenObject.data.token;

    let users = readTable('users');
    let userIndex = -1;

    for(let i = 0; i < users.length; i++) {
        if(users[i].sessionToken === sessionToken) {
            userIndex = i;
            break;
        }
    }

    if(userIndex === -1) {
        return createMessage(false, 'User not found');
    }

    let savedList = users[userIndex].savedRecipes || [];
    recipeId = String(recipeId); 
    if(savedList.includes(recipeId)) {
        let newSavedList = []
        for(let id of savedList) {
            if(id !== recipeId) {
                newSavedList.push(id);
            }
        }
        savedList = newSavedList;
    } else {
        savedList.push(recipeId);
    }

    users[userIndex].savedRecipes = savedList;
    writeTable('users', users);

    return createMessage(true, 'Favourite toggled successfully');
}

/**
 * Retrieves the list of favourite recipes for the authenticated user.
 * @returns { Object } A message object containing the list of favourite recipes or an error message if the user is not authenticated or not found.
 */
export function getUserFavourites() {
    let sessionTokenObject = retrieveLocalToken();
    if(sessionTokenObject.success === false) {
        return createMessage(false, 'User not authenticated');
    }
    let sessionToken = sessionTokenObject.data.token;

    let users = readTable('users');
    let userIndex = -1;

    for(let i = 0; i < users.length; i++) {
        if(users[i].token === sessionToken) {
            userIndex = i;
            break;
        }
    }

    if(userIndex === -1) {
        return createMessage(false, 'User not found');
    }

    if(!users[userIndex].savedRecipes || users[userIndex].savedRecipes.length === 0) {
        return createMessage(true, 'No favourite recipes found', []);
    }

    let allRecipes = getRecipes();
    let favouriteRecipes = [];
    
    for(let recipe of allRecipes) {
        if(users[userIndex].savedRecipes.includes(String(recipe.id))) {
            favouriteRecipes.push(recipe);
        }
    }

    return createMessage(true, 'Favourites retrieved successfully', favouriteRecipes);
}

/** ===============================================================================================
 * The following functions should actually be implemented in the UI layer...
 * We'll keep them here for now until the "Favourites dev" started implementing then
 * Then we can move them there
 */

/**
 * @returns { number } The count of favourite recipes. 
 */
export function countFavourites() {
    return getUserFavourites().length;
}

/**
 * @returns { boolean } True if the user's favourites list is empty, false otherwise. 
 */
export function isFavouritesEmpty() {
    return countFavourites() === 0;
}

/**
 * Filters the user's favourite recipes by course category.
 * @param { string } courseCategory - The category of courses to filter by.
 * @returns { Object } A message object containing the filtered favourite recipes. If no category is specified or if 'all' is specified, it will return all favourite recipes.
 */
export function filterFavouriteRecipes(courseCategory) {
    let favourites = getUserFavourites();
    if(!courseCategory || courseCategory.toLowerCase() === 'all') {
        return createMessage(true, 'No course category specified. All favourite recipes were retrieved.', favourites);
    }
    let filtered = [];
    for(let recipe of favourites) {
        if(recipe.courseType.toLowerCase() === courseCategory.toLowerCase()) {
            filtered.push(recipe);
        }
    }
    return createMessage(true, 'Filtered favourite recipes retrieved successfully', filtered);
}

