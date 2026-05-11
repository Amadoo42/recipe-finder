/**
 * db-recipes.js
 * CRUD operations and search logic for Recipes.
 * Depends on: requests.js
*/

import { getRequest, postRequest, deleteRequest } from '/static/api/request.js';
/**
 * Retrieves all recipes from the server.
 * @returns { Promise<Array> } - A promise that resolves to an array of recipe objects.
 */
export async function getRecipes() {
    const response = await getRequest('/admin/get_all_recipes/');
    if (response.success && Array.isArray(response.recipes)) {
        return response.recipes;
    }
    else {
        return [];
    }
}

/**
 * Retrieves a specific recipe by its unique ID.
 * @param { number } recipeId - The ID of the recipe to retrieve.
 * @returns { Promise<Object> } - A promise that resolves to the recipe object.
 */
export async function getRecipeById(recipeId) {
    const params = new URLSearchParams();
    params.append('RecipeID', recipeId);
    const result = await getRequest('/admin/get_recipe_by_id/', params);
    if (result.success) {
        console.log(result);
        return result.recipe;
    }
    else {
        return {"Error": "No recipe found by this id"};
    }
}

/**
 * Adds a new ingredient to the database.
 * @param { Object } data - The ingredient data to be saved.
 * @returns { Promise<Object> } - A promise that resolves to the server response.
 */
export async function addIngredientDB(data) {
    const result = await postRequest('/admin/add_ingredient/', data);
    return result;
}

/**
 * Searches for ingredients by name.
 * @returns { Promise<Array> } - A promise that resolves to a list of matching ingredients.
 */
export async function getAllIngredients() {
    const result = await getRequest('/admin/get_all_ingredients/');
    if (result.success && Array.isArray(result.ingredients)) {
        return result.ingredients.map(ing => ing.name);
    }
    else {
        return [];
    }
}

/**
 * Adds a new custom ingredient.
 * @param { Object } data - The unit data to be saved.
 * @returns { Promise<Object> } - A promise that resolves to the server response.
 */
export async function addOtherUnitDB(data) {
    const result = await postRequest('/admin/add_other_unit/', data);
    return result;
}

/**
 * Adds a new recipe to the database. 
 * @param { Object } data - The recipe data object.
 * @returns { Promise<Object> } - A promise that resolves to the server response.
 */
export async function addRecipe(data) {
    const result = await postRequest('/admin/add_recipe/', data);
    console.log(result);
    return result;
}

/**
 * Updates an existing recipe's information in the database.
 * @param { number } recipeId - The ID of the recipe to update.
 * @param { Object } data - The updated recipe data.
 * @returns { Promise<Object> } - A message object indicating the result of the operation.
 */
export async function updateRecipe(recipeId, data) {
    data['recipe_id'] = recipeId;
    const result = await postRequest('/admin/update_recipe/', data);
    return result;
}

/**
 * Deletes a recipe from the database.
 * @param { number } recipeId - The ID of the recipe to delete.
 * @returns { Object } - A message object indicating success or failure.
 */
export async function deleteRecipe(recipeId) {
    const result = await deleteRequest('/admin/delete_recipe/', {'id': recipeId });
    return result;
}

/**
 * Searches for recipes based on a query text and course filter.
 * Sends a GET request to /api/recipes/ with search and category query parameters.
 * @param { string } queryText - The text to search for in recipe titles, descriptions, and ingredients.
 * @param { string } courseFilter - The course type to filter by.
 * @returns { Promise<Object> } - A message object with success status and matching recipes in data.
 */
export async function searchRecipes(queryText, courseFilter) {
    try{
        const params = new URLSearchParams();
        params.append('search', queryText || '');
        params.append('category', courseFilter || 'all');

        const response = await fetch(`/api/recipes/?${params}`);

        if (!response.ok) {
            return createMessage(false, 'Server error: ' + response.status);
        }

        const json = await response.json();
        return json;
    }
    catch (error){
        return createMessage(false, 'Network error: ' + error.message);
    }
}