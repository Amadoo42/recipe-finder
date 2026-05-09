/**
 * db-recipes.js
 * CRUD operations and search logic for Recipes.
 * Depends on: db-core.js
*/

import { readTable, writeTable } from '/static/shared/database/db-core.js';
import { createMessage } from '/static/shared/utils/create-message.js';

/**
 * Retrieves all recipes from the database.
 * @returns { Array } - An array of recipe objects.
 */
export function getRecipes() {
    return readTable('recipes') || [];
}

/**
 * Retrieves a recipe by its ID from the database.
 * @param { string } recipeId - The ID of the recipe to retrieve.
 * @returns { Object | null } - The recipe object if found, otherwise null.
 */
export async function getRecipeById(recipeId) {
    try{
        const respond = await fetch(`/api/recipes/${recipeId}/`);
        if(!respond.ok)
            console.error(`Failed to fetch recipe ${recipeId}:HTTP${respond.status}`);
        return null;
        const json = await respond.json();
        return json.success? json.data():null;
        }
    catch(error){
        console.error('Network error fetching recipe:',error);
        return null;
        }
    }

/**
 * Adds a new recipe to the database. 
 * The recipe object should already be standardized using createRecipeObject from schema-factories.js before being passed to this function.
 * @param { Object } recipe - The recipe object to add to the database.
 * @return { Object } - A message object indicating success or failure of the operation, along with the added recipe if successful.
 */
export function addRecipe(recipe) {
    try {
        let recipes = getRecipes();

        // Here we just auto-increment the ID based on the highest existing ID
        let newId = 1;
        if(recipes.length > 0) {
            let maxId = 1; 
            for(let r of recipes) {
                if(Number(r.id) > maxId) {
                    maxId = Number(r.id);
                }
            }
            newId = maxId + 1;
        }

        recipe.id = newId;
        recipes.push(recipe);
        writeTable('recipes', recipes);
        // Here we return the newly added recipe in the payload so that the caller can easily access the assigned ID.
        return createMessage(true, 'Recipe added successfully', recipe);
    } catch(error) {
        return createMessage(false, 'Failed to add recipe to the database');
    }
}

/**
 * Updates a recipe in the database.
 * @param { string } recipeId - The ID of the recipe to update.
 * @param { Object } updatedRecipe - The updated recipe object.
 * @returns { Object } - A message object indicating the result of the operation.
 */
export function updateRecipe(recipeId, updatedRecipe) {
    let recipes = getRecipes();
    let index = -1;
    for(let i = 0; i < recipes.length; i++) {
        if(String(recipes[i].id) === String(recipeId)) {
            index = i;
            break;
        }
    }

    if(index !== -1) {
        updatedRecipe.id = recipes[index].id;
        recipes[index] = updatedRecipe;
        writeTable('recipes', recipes);
        return createMessage(true, 'Recipe updated successfully', updatedRecipe);
    }
    return createMessage(false, 'Recipe not found');
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