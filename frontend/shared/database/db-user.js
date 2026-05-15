/**
 * db-user.js
 * User-specific interactions (favourites logic only for now).
 * Depends on: db-core.js, db-auth.js, db-recipes.js
 */

import { createMessage } from '/static/shared/utils/create-message.js';
import { getCsrfToken } from '/static/shared/utils/csrf.js';


/**
 * Toggles the favourite status of a recipe for the authenticated user.
 * If the recipe is already in the user's savedRecipes list, it will be removed; otherwise, it will be added.
 * @param { string } recipeId - The ID of the recipe to toggle as a favourite.
 * @returns { Object } A message object indicating success or failure of the operation.
 */
export async function toggleFavourite(recipeId) {
    try {
        const response = await fetch(`/api/user/favourites/${recipeId}/toggle/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCsrfToken(),
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 401) {
            return createMessage(false, 'User not authenticated.');
        }
        if (!response.ok) {
            return createMessage(false, 'Failed to fetch favourites from server.');
        }
        const json = await response.json();
        return json
    }
    catch (error) {
        console.error('Network error fetching favourites:', error);
        return createMessage(false, 'Network problem')
    }
}

/**
 * Retrieves the list of favourite recipes for the authenticated user.
 * @returns { Object } A message object containing the list of favourite recipes or an error message if the user is not authenticated or not found.
 */
export async function getUserFavourites() {
    try {
        const response = await fetch(`/api/user/favourites/`);

        if (response.status === 401) {
            return createMessage(false, 'User not authenticated.');
        }
        if (!response.ok)
            return createMessage(false, 'Failed to fetch favourites from server.');
        const json = await response.json();
        return json;
    }
    catch (error) {
        console.error('Network error fetching favourites:', error);
        return createMessage(false, 'Network problem');

    }
}
