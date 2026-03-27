import { getUserFavourites } from "../database/db-user.js";
import { getRecipes } from "../database/db-recipes.js";
import { createMessage } from "./create-message.js";

/**
 * Filters recipes by course category from the selected source.
 * @param { string } courseCategory - Category to filter by.
 * @param { "favourites" | "all" } source - The recipe source to filter.
 * @returns { Object } A message object with the filtered recipes.
 */
export function filterRecipesByCategory(courseCategory, source) {
    let recipes = [];

    if(source === "all") {
        recipes = getRecipes();
    }
    else if (source === "favourites") {
        let response = getUserFavourites();
        if (response.success === false) {
            return createMessage(false, "User not authenticated or not found");
        }
        recipes = response.data;
    } 
    else {
        return createMessage(false, "Invalid filter source. Use 'all' or 'favourites'.");
    }

    if(!courseCategory || courseCategory.toLowerCase() === "all") {
        return createMessage(true, "No course category specified. All recipes from source were retrieved.", recipes);
    }

    let filtered = [];
    for(let recipe of recipes) {
        if(recipe.courseType.toLowerCase() === courseCategory.toLowerCase()) {
            filtered.push(recipe);
        }
    }

    return createMessage(true, "Filtered recipes retrieved successfully", filtered);
}