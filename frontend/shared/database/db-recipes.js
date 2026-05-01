/**
 * db-recipes.js
 * CRUD operations and search logic for Recipes.
 * Depends on: db-core.js
*/

import { readTable, writeTable } from '/static/shared/database/db-core.js';
import { createMessage } from '/static/shared/utils/create-message.js';
import { getRequest, postRequest } from '/static/api/request.js';
/**
 * Retrieves all recipes from the database.
 * @returns { Array } - An array of recipe objects.
 */
export async function getRecipes() {
    const response = await getRequest('/admin/get_all_recipes/');
    return response;
}

/**
 * Retrieves a recipe by its ID from the database.
 * @param { string } recipeId - The ID of the recipe to retrieve.
 * @returns { Object | null } - The recipe object if found, otherwise null.
 */
export async function getRecipeById(recipeId) {
    const params = new URLSearchParams();
    params.append('RecipeID', recipeId);
    const result = await getRequest('/admin/get_recipe_by_id/', params);
    return result;
}

export async function addIngredientDB(data) {
    const result = await postRequest('/admin/add_ingredient/', data);
    return result;
}

export async function searchIngredients(query) {
    const params = new URLSearchParams();
    params.append('query', query);
    const result = await getRequest('/admin/search_ingredient/', params);
    return result;
}

export async function addOtherUnitDB(data) {
    const result = await postRequest('/admin/add_other_unit/', data);
    return result;
}

/**
 * Adds a new recipe to the database. 
 * The recipe object should already be standardized using createRecipeObject from schema-factories.js before being passed to this function.
 * @param { Object } recipe - The recipe object to add to the database.
 * @return { Object } - A message object indicating success or failure of the operation, along with the added recipe if successful.
 */
export async function addRecipe(data) {
    const result = await postRequest('/admin/add_recipe/', data);
    return result;
}

/**
 * Updates a recipe in the database.
 * @param { string } recipeId - The ID of the recipe to update.
 * @param { Object } updatedRecipe - The updated recipe object.
 * @returns { Object } - A message object indicating the result of the operation.
 */
export async function updateRecipe(recipeId, data) {
    data['recipe_id'] = recipeId;
    const result = await postRequest('/admin/update_recipe/', data);
    return result;
}

/**
 * Deletes a recipe from the database.
 * @param { string } recipeId - The ID of the recipe to delete.
 * @returns { Object } - A message object indicating the result of the operation.
 */
export function deleteRecipe(recipeId) {
    let recipes = getRecipes();
    let filteredRecipes = [];
    let found = false;
    for(let r of recipes) {
        if(String(r.id) === String(recipeId)) {
            found = true;
            continue; 
        }
        filteredRecipes.push(r);
    }
    if(found) {
        writeTable('recipes', filteredRecipes);
        return createMessage(true, 'Recipe deleted successfully');
    }
    return createMessage(false, 'Recipe not found');
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