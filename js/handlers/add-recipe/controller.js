import {createRecipeObject, createIngredientObject} from "../../utils/schema-factories.js";
import {addRecipe, updateRecipe} from "../../database/db-recipes.js";
import {processUploadedImage,  processOnlineImageURL} from "../../utils/process-image.js"
import { sharedData } from "./shared-data.js";
import * as UI from "./ui-handler.js"
import * as VALIDATOR from "../../utils/recipe-validator.js"

// URL parameters to choose between edit mode and creation mode
let isEdit;
let recipeID;

// Current List of Ingredients
let ingredients = [];

// Validates the name, quantity inputs and appends a new list item to the ingredient list
function addNewIngredient() {
    const {name, quantity, unit} = UI.getIngredientInput()
    const {invalidName, invalidQuantity} = VALIDATOR.validateIngredientInput(name, quantity);
    
    UI.toggleUIComponent(UI.ERROR_MESSAGES.ingredientNameErrorMessage, invalidName);
    UI.toggleUIComponent(UI.ERROR_MESSAGES.quantityErrorMessage, invalidQuantity)

    if (invalidName || invalidQuantity) return;

    ingredients.push({name, quantity, unit});

    UI.renderIngredientList(ingredients, removeIngredient);
    UI.resetIngredientInput();
}

function removeIngredient(index) {
    ingredients.splice(index, 1);
    UI.renderIngredientList(ingredients, removeIngredient);
}

// Validates and adds a user-defined unit to the ingredient unit dropdown list
function addOtherUnit() {
    UI.toggleUIComponent(UI.ERROR_MESSAGES.ingredientUnitErrorMessage, false);

    const {newUnit, options} = UI.getOtherUnitData();
    const inputValidation = VALIDATOR.validateOtherUnitInput(newUnit, options);

    if (inputValidation.valid) {
        UI.addOtherUnitOption(inputValidation.unique);
    }
    else {
        UI.toggleUIComponent(UI.ERROR_MESSAGES.ingredientUnitErrorMessage, true);
        return;
    }

    UI.toggleOtherUnitModal(false);
}

async function getImageData() {
    const {localImage, URL} = UI.getImageInput();

    let inputImageData = await processUploadedImage(localImage);
    if (inputImageData) return {data: inputImageData, valid: true};
    
    const result = await processOnlineImageURL(URL, UI.ERROR_MESSAGES.imageURLErrorMessage);
    if (result.valid && result.imageData) return {data: result.imageData, valid: true};
    else if (!result.valid) return {data: "", valid: false};
    
    if (isEdit) return {data: sharedData.imageLoadedData, valid: true};

    return {data: "", valid: true};
}

function handleSaveResult(result) {
    if (result && result.success === true) {
        alert(isEdit ? "Recipe edited!" : "Recipe added!");
        return true;
    }
    else if (result && result.description) {
        alert(result.description);
        return false;
    }
    alert(result.description ?? (isEdit ? "Failed to edit recipe" : "Failed to add recipe"));
    return false;
}

function saveRecipe(recipe) {
    let result;
    if (isEdit) {
        result = updateRecipe(recipeID, recipe);
    }
    else {
        result = addRecipe(recipe);
    }
    return handleSaveResult(result);
}

// Processes images (local or URL), maps ingredients, and sends the final object to the database.
async function addRecipeHandler() {
    const image = await getImageData();
    if (!image.valid) return;

    const {name, description, course} = UI.getRecipeInput();
    const {invalidName, invalidDescription, invalidCourse} = VALIDATOR.validateRecipeInput(name, description, course);
    if (invalidName || invalidDescription || invalidCourse) {
        alert("Recipe details cannot include numbers or special characters");
        return;
    }

    let recipe = createRecipeObject(name, description, course, ingredients, image.data);
    if (saveRecipe(recipe)) {
        window.location.replace("view-recipe.html");
    }
}

// initalize event listners and fetch URL parameters
function init() {
    UI.initUI(addNewIngredient, addRecipeHandler, addOtherUnit);
    isEdit = sharedData.isEdit;
    recipeID = sharedData.recipeID;
    ingredients = sharedData.ingredients;
};
init();