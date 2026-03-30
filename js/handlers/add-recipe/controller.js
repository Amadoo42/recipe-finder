import {createRecipeObject} from "../../utils/schema-factories.js";
import {addRecipe, updateRecipe, getRecipeById} from "../../database/db-recipes.js";
import {processUploadedImage,  processOnlineImageURL} from "../../utils/process-image.js"
import { createMessage } from "../../utils/create-message.js";
import * as UI from "./ui-handler.js"
import * as VALIDATOR from "../../utils/recipe-validator.js"

// URL parameters to choose between edit mode and creation mode
let isEdit;
let recipeID;
let loadedImageData = "";

// Current List of Ingredients
let ingredients = [];

// Validates the name, quantity inputs and appends a new list item to the ingredient list
function addNewIngredient() {
    const {name, quantity, unit} = UI.getIngredientInput()


    const trimmedName = name ? name.trim() : "";
    const {invalidName: baseInvalidName, invalidQuantity} = VALIDATOR.validateIngredientInput(trimmedName, quantity);
    const invalidName = baseInvalidName || trimmedName === "";
    
    UI.toggleUIComponent(UI.ERROR_MESSAGES.ingredientNameErrorMessage, invalidName);
    UI.toggleUIComponent(UI.ERROR_MESSAGES.quantityErrorMessage, invalidQuantity)
    if (invalidName || invalidQuantity) return;
    ingredients.push({name: trimmedName, quantity, unit});

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

    let localImageResult = await processUploadedImage(localImage);
    if (localImageResult.success && localImageResult.data) {
        return createMessage(true, "Loaded local image successfully", localImageResult.data);
    }
    
    let urlImageResult;
    try {
        urlImageResult = await processOnlineImageURL(URL);
    }
    catch (err) {
        console.log(err);
    }
    console.log(typeof(urlImageResult));
    if (urlImageResult.success && urlImageResult.data) return createMessage(true, "Image URL is valid", urlImageResult.data);
    else if (!urlImageResult.success) {
        UI.toggleUIComponent(UI.ERROR_MESSAGES.imageURLErrorMessage, true);
		return createMessage(false, "Image URL is invalid");
	}
    UI.toggleUIComponent(UI.ERROR_MESSAGES.imageURLErrorMessage, false);
 
    if (isEdit) return createMessage(true, "Used the previously set image", loadedImageData);

    return createMessage(true, "No Image Specified");
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

async function saveRecipe(recipe) {
    let result;
    if (isEdit) {
        result = await updateRecipe(recipeID, recipe);
    }
    else {
        result = await addRecipe(recipe);
    }
    return handleSaveResult(result);
}

// Processes images (local or URL), maps ingredients, and sends the final object to the database.
async function addRecipeHandler() {
    const image = await getImageData();
    if (!image.success) return;

    const {name, description, course} = UI.getRecipeInput();
    const {invalidName, invalidDescription, invalidCourse} = VALIDATOR.validateRecipeInput(name, description, course);
    if (invalidName || invalidDescription || invalidCourse) {
        alert("Recipe details cannot include numbers or special characters");
        return;
    }

    let recipe = createRecipeObject(name, description, course, ingredients, image.data);
    if (await saveRecipe(recipe)) {
        window.location.replace("view-recipe.html");
    }
}

// initalize event listners and fetch URL parameters
function init() {
    UI.initUI(addNewIngredient, addRecipeHandler, addOtherUnit);

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    recipeID = params.get('RecipeID');
    isEdit = params.get('Edit');

    UI.renderHeader(isEdit);
    if (isEdit) {
        let recipe = getRecipeById(recipeID);
        UI.renderRecipeDetails(recipe.name, recipe.courseType, recipe.description);
        ingredients = [...recipe.ingredients]; 
        loadedImageData = recipe.image;
    }
    UI.renderIngredientList(ingredients, removeIngredient);
};
init();
