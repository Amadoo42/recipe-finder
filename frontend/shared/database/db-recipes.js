/**
 * db-recipes.js
 * CRUD operations and search logic for Recipes.
 * Depends on: requests.js
*/

import { readTable, writeTable } from '/static/shared/database/db-core.js';
import { createMessage } from '/static/shared/utils/create-message.js';
import { getRequest, postRequest, deleteRequest } from '/static/api/request.js';
/**
 * Retrieves all recipes from the server.
 * @returns { Promise<Array> } - A promise that resolves to an array of recipe objects.
 */
export async function getRecipes() {
    const response = await getRequest('/admin/get_all_recipes/');
    return response;
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
    // console.log(result);
    return result;
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
    return result;
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
    await deleteRequest('/admin/delete_recipe/', {'id': recipeId })
}

/**
 * Searches for recipes based on a query text and course filter.
 * @param { string } queryText - The text to search for in recipe titles, descriptions, and ingredients.
 * @param { string } courseFilter - The course type to filter by.
 * @returns { Array } - An array of matching recipe objects.
 */
export function searchRecipes(queryText, courseFilter) {
    let recipes = getRecipes();
    let results = recipes;
    
    if(courseFilter && courseFilter.toLowerCase() !== 'all') {
        let temp = []
        for(let r of results) {
            if(r.courseType.toLowerCase() === courseFilter.toLowerCase()) {
                temp.push(r);
            }
        }
        results = temp;
    }

    if(queryText && queryText.trim() !== '') {
        let query = queryText.toLowerCase().trim();
        let finalResults = [];
        for(let r of results) {
            let haveTitle = r.name.toLowerCase().includes(query);
            let haveDescription = r.description.toLowerCase().includes(query);
            let foundIngredient = false;
            for(let ingredient of r.ingredients) {
                if(ingredient.name.toLowerCase().includes(query)) {
                    foundIngredient = true;
                    break;
                }
            }
            if(haveTitle || foundIngredient || haveDescription) {
                finalResults.push(r);
            }
        }
        return finalResults;
    }
    return results;
}