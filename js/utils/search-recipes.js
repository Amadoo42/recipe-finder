
import { createMessage } from "./create-message.js";
import { filterRecipesByCategory } from "./filter-recipes.js";

/**
 * Searches for recipes based on a query to match with recipe names and a source, and optional course category.
 * @param {string} query 
 * @param { "all" | "favourites" } source 
 * @param {string} [courseCategory="all"] - optional course category to filter by.
 * @returns {Object} A message object containing the search results or an error message.
 */
export function searchRecipes(query, source, courseCategory = "all") {
    
    let filterResult = filterRecipesByCategory(courseCategory, source);
    if (!filterResult.success) {
        return filterResult;
    }

    let recipes = filterResult.data;

    if (!query || query.trim() === "") {
        return createMessage(true, "No query provided. All recipes from source were retrieved.", recipes);
    }

    let found =[];
    for(let recipe of recipes) {
        if(
            recipe.name.toLowerCase().includes(query.trim().toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.trim().toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query.trim().toLowerCase()))    
        ) {
            found.push(recipe);
        }
    }

    return createMessage(true, `${found.length} recipes found matching the query.`, found);
}