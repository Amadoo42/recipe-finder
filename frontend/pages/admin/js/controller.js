import { addIngredientDB, addOtherUnitDB, addRecipe, updateRecipe, getRecipeById, searchIngredients } from "/static/shared/database/db-recipes.js";
import { toggleErrorMessageList } from "/static/shared/utils/error-message.js"
import * as UI from "/static/pages/admin/js/ui-handler.js";

// URL parameters to choose between edit mode and creation mode
let isEdit;
let recipeID;

// Current List of Ingredients
let ingredients = [];


// Validates the name, quantity inputs and appends a new list item to the ingredient list
async function addNewIngredient() {
    UI.resetIngredientSuggestions();
    toggleErrorMessageList(UI.INGREDIENT_ERROR_MESSAGES, false);

    const data = UI.getIngredientInput();
    const result = await addIngredientDB(data);

    if (!result.success) {
        toggleErrorMessageList(UI.INGREDIENT_ERROR_MESSAGES, true, result.errors);
    }
    else {
        ingredients.push({
            name: data.name,
            quantity: data.quantity,
            unit: data.unit
        });
        UI.renderIngredientList(ingredients, removeIngredient);
        UI.resetIngredientInput();
    }
}

function removeIngredient(index) {
    ingredients.splice(index, 1);
    UI.renderIngredientList(ingredients, removeIngredient);
}

async function ingredientSearch(e) {
    let query = e.target.value.trim();
    if (!query) {
        UI.resetIngredientSuggestions();
        return;
    }
    let timer;
    clearTimeout(timer);
    timer = setTimeout(async () => {
        const suggestions = await searchIngredients(query);
        UI.renderIngredientSuggestions(suggestions.ingredients);
    }, 500);
}

// Validates and adds a user-defined unit to the ingredient unit dropdown list
async function addOtherUnit() {
    toggleErrorMessageList(UI.OTHER_ERROR_MESSAGES, false);

    const data = UI.getOtherUnitData();
    const result = await addOtherUnitDB(data);
    if (!result.success) {
        toggleErrorMessageList(UI.OTHER_ERROR_MESSAGES, true, result.errors);
        return;
    }
    else {
        UI.addOtherUnitOption(data.unit);
    }
    UI.toggleOtherUnitModal(false);
}

async function saveRecipe(data) {
    let result;
    if (isEdit) {
        result = await updateRecipe(recipeID, data);
    }
    else {
        result = await addRecipe(data);
    }
    return result;
}

// Processes images (local or URL), maps ingredients, and sends the final object to the database.
async function addRecipeHandler() {
    toggleErrorMessageList(UI.RECIPE_ERROR_MESSAGES, false);

    const {image_file, image_url} = UI.getImageInput();
    let data = UI.getRecipeInput();
    const ingredients_list = JSON.stringify(ingredients);
    data = {...data, image_file, image_url, ingredients_list};
    
    const result = await saveRecipe(data);
    if (!result.success) {
        toggleErrorMessageList(UI.RECIPE_ERROR_MESSAGES, true, result.errors);
        return;
    }
    else {
        alert(isEdit ? "Recipe edited!" : "Recipe added!");
        window.location.replace("/admin/explore/");
    }
}

// initalize event listners and fetch URL parameters
async function init() {
    UI.initUI(addNewIngredient, addRecipeHandler, addOtherUnit, ingredientSearch);

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    recipeID = params.get('RecipeID');
    isEdit = params.get('Edit');

    UI.renderHeader(isEdit);
    if (isEdit) {
        const response = await getRecipeById(recipeID);
        const recipe = response.recipe;
        console.log(recipe);
        UI.renderRecipeDetails(recipe.name, recipe.courseType, recipe.description);
        ingredients = [...ingredients, ...recipe.ingredients];
    }
    UI.renderIngredientList(ingredients, removeIngredient);
};
init();