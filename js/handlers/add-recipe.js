import {createRecipeObject, createIngredientObject} from "../utils/schema-factories.js";
import {addRecipe, updateRecipe} from "../database/db-recipes.js";
import {processUploadedImage,  processOnlineImageURL} from "../utils/process-image.js"
import * as VALIDATOR from "../utils/recipe-validator.js"
import { imageLoadedData } from "./edit-recipe.js";

// URL parameters to choose between edit mode and creation mode
let isEdit;
let recipeID;

// A centralized object containing references to all required HTML elements
const DOM = {
    form: document.querySelector("form"),
    // RECIPE INPUT
    recipeName: document.querySelector("input[name='recipe-name']"),
    recipeCourse: document.querySelector("#course"),
    recipeDescription: document.querySelector("textarea"),

    // INGREDIENT LIST VALUES
    ingredientList: document.getElementById("ingredientList"),
    ingredientListNames: document.getElementsByClassName("IngredientName"),
    ingredientListQuantities: document.getElementsByClassName("IngredientQuantity"),
    ingredientListUnits: document.getElementsByClassName("IngredientUnit"),

    // INGREDIENT INPUT
    unitSelect: document.getElementById("unit"),
    ingredientNameInput: document.querySelector("#ingredientName"),
    ingredientQuantityInput: document.querySelector("#quantity"),
    ingredientUnitInput: document.querySelector("#unit"),
    addIngredientBtn: document.getElementById("addIngredient"),

    // CUSTOM INGREDIENT UNIT
    customUnitModalContainer: document.getElementById("customUnitContainer"),
    customUnitModal: document.getElementById("customUnitPrompt"),
    customUnitModalAddBtn: document.getElementById("addCustomUnit"),
    customUnitModalCancelBtn: document.getElementById("cancelCustomUnit"),
    otherUnitEntry: document.getElementById("otherUnit"),
    customUnitInput: document.querySelector("input[name='custom-unit']"),

    // IMAGE INPUT
    imageInput: document.getElementById("imageSelector"),
    imageURLInput: document.getElementById("onlineImageSelector"),

    submitRecipeBtn: document.getElementById("addRecipe")
};

// References to all UI error message elements
const ERROR_MESSAGES = {
    ingredientUnitErrorMessage: document.getElementById("customUnitErrorMessage"),
    ingredientNameErrorMessage: document.getElementById("ingredientNameErrorMessage"),
    quantityErrorMessage: document.getElementById("quantityErrorMessage"),
    imageURLErrorMessage: document.getElementById("imageURLErrorMessage")
}

const CSS_CLASSES = {
    SHOW: 'show'
};

const DEFAULT_VALUES = {
    UNIT: 'Cups'
};

// Toggle the visibility of an element using the 'show' css class
function toggleUIComponent(component, value) {
    component.classList.toggle(CSS_CLASSES.SHOW, value);
}

// toggle the custom unit input modal
function toggleOtherUnitModal(val) {
    toggleUIComponent(DOM.customUnitModalContainer, val)
    toggleUIComponent(DOM.customUnitModal, val)
}

// Validates and adds a user-defined unit to the ingredient unit dropdown list
function addOtherUnit() {
    toggleUIComponent(ERROR_MESSAGES.ingredientUnitErrorMessage, false);

    const inputValidation = VALIDATOR.validateOtherUnitInput(DOM.customUnitInput.value, DOM.ingredientUnitInput.options);
    if (inputValidation.valid && inputValidation.unique) {
        let newOption = document.createElement("option");
        newOption.innerHTML = DOM.customUnitInput.value;
        DOM.ingredientUnitInput.insertBefore(newOption, DOM.otherUnitEntry);
        DOM.ingredientUnitInput.value = DOM.customUnitInput.value;       
    }
    else if (inputValidation.valid && !inputValidation.unique) {
        DOM.ingredientUnitInput.value = DOM.customUnitInput.value;
    }
    else {
        toggleUIComponent(ERROR_MESSAGES.ingredientUnitErrorMessage, true);
        return;
    }
    DOM.customUnitInput.value = "";
    toggleOtherUnitModal(false);
}

// Closes the custom unit modal and resets the selection
function cancelOtherUnit() {
    DOM.unitSelect.selectedIndex = 0;
    toggleOtherUnitModal(false);
}

// Validates the name, quantity inputs and appends a new list item to the ingredient list
function addNewIngredient() {
    const invalidName = VALIDATOR.matchAgainstREGEX(DOM.ingredientNameInput.value, VALIDATOR.REGEX.ALPHA_ONLY);
    toggleUIComponent(ERROR_MESSAGES.ingredientNameErrorMessage, invalidName);

    const quantity = Number(DOM.ingredientQuantityInput.value);
    const invalidQuantity = isNaN(quantity) || quantity <= 0;
    toggleUIComponent(ERROR_MESSAGES.quantityErrorMessage, invalidQuantity)
    if (invalidName || invalidQuantity) return;

    const item = document.createElement("li");
    item.className = "IngredientListItem";
    item.innerHTML = `
        <div class="ItemContainer">
            <p class="IngredientName">${DOM.ingredientNameInput.value}</p>
            <div>
                <p class="IngredientQuantity">${quantity}</p>
                <p class="IngredientUnit">${DOM.ingredientUnitInput.value}</p>
            </div>
        </div>
        <button class="DeleteBtn">X</button>
    `;

    item.querySelector(".DeleteBtn").addEventListener("click", function() { item.remove() });
    DOM.ingredientList.appendChild(item);

    DOM.ingredientNameInput.value = "";
    DOM.ingredientQuantityInput.value = "";
    DOM.ingredientUnitInput.value = DEFAULT_VALUES.UNIT;
}

async function getImageData() {
    let inputImageData = await processUploadedImage(DOM.imageInput);
    if (inputImageData) return inputImageData;
    
    const result = await processOnlineImageURL(DOM.imageURLInput, ERROR_MESSAGES.imageURLErrorMessage);
    if (result.valid && result.imageData) return result.imageData;
    else if (!result.valid) return "INVALID_URL";
    
    if (isEdit) return imageLoadedData;

    return "";
}

// Processes images (local or URL), maps ingredients, and sends the final object to the database.
async function addRecipeHandler() {
    let imageData = await getImageData();
    if (imageData === "INVALID_URL") return;

    let ingredients = []
    for (let i = 0; i < DOM.ingredientListNames.length; i++) {
        const quantity = parseFloat(DOM.ingredientListQuantities[i].textContent);
        const ingredient = createIngredientObject(DOM.ingredientListNames[i].textContent, quantity, DOM.ingredientListUnits[i].textContent);
        ingredients.push(ingredient);
    }

    let recipe = createRecipeObject(DOM.recipeName.value, DOM.recipeDescription.value, DOM.recipeCourse.value, ingredients, imageData);
    console.log("Sending Recipe to DB:", recipe);

    let result;
    if (isEdit) {
        result = await updateRecipe(recipeID, recipe);
    }
    else {
        result = await addRecipe(recipe);
    }

    if (result && result.success === true) {
        if (!isEdit) alert("Added Recipe!");
        else alert("Edited Recipe!")
        window.location.replace("view-recipe.html");
    }
    else if (result && result.description) {
        alert(result.description);
    }
    else {
        if (!isEdit) alert("Failed to add recipe");
        else alert("Failed to edit recipe")
    }
}

// initalize event listners and fetch URL parameters
const init = () => {
    DOM.unitSelect.addEventListener("change", function () {
        toggleOtherUnitModal(DOM.ingredientUnitInput.value === "Other")
    });
    DOM.addIngredientBtn.addEventListener("click", addNewIngredient);
    DOM.submitRecipeBtn.addEventListener("click", addRecipeHandler);
    DOM.customUnitModalCancelBtn.addEventListener("click", cancelOtherUnit);
    DOM.customUnitModalAddBtn.addEventListener("click", addOtherUnit);

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    isEdit = params.get('Edit');
    recipeID = params.get('RecipeID');
};
init();