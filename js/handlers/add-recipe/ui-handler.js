import * as CONST from '../../constants/recipe-constants.js'

// A centralized object containing references to all required HTML elements
const DOM = {
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
export const ERROR_MESSAGES = {
    ingredientUnitErrorMessage: document.getElementById("customUnitErrorMessage"),
    ingredientNameErrorMessage: document.getElementById("ingredientNameErrorMessage"),
    quantityErrorMessage: document.getElementById("quantityErrorMessage"),
    imageURLErrorMessage: document.getElementById("imageURLErrorMessage")
}

// Toggle the visibility of an element using the 'show' css class
export function toggleUIComponent(component, value) {
    component.classList.toggle(CONST.CSS_CLASSES.SHOW, value);
}

export function createIngredientListItem(name, quantity, unit, index, removeIngredient) {
    const item = document.createElement("li");
    item.className = "IngredientListItem";
    item.innerHTML = `
        <div class="ItemContainer">
            <p class="IngredientName">${name}</p>
            <div>
                <p class="IngredientQuantity">${quantity}</p>
                <p class="IngredientUnit">${unit}</p>
            </div>
        </div>
        <button class="DeleteBtn" data-index="${index}">X</button>
    `;
    
    item.querySelector(".DeleteBtn").addEventListener("click", () => {
        removeIngredient(index);
    });
    return item;
}

export function renderIngredientList(ingredients, removeIngredient) {
    DOM.ingredientList.innerHTML = "";
    ingredients.forEach((ingredient, index) => {
        const item = createIngredientListItem(ingredient.name, ingredient.quantity, ingredient.unit, index, removeIngredient);
        DOM.ingredientList.appendChild(item);
    });
}

export function getIngredientInput() {
    return {
        name: DOM.ingredientNameInput.value,
        quantity: parseFloat(DOM.ingredientQuantityInput.value),
        unit: DOM.ingredientUnitInput.value
    }
}

export function resetIngredientInput() {
    DOM.ingredientNameInput.value = "";
    DOM.ingredientQuantityInput.value = "";
    DOM.ingredientUnitInput.value = CONST.DEFAULT_VALUES.UNIT;
}

export function getRecipeInput() {
    return {
        name: DOM.recipeName.value,
        description: DOM.recipeDescription.value,
        course: DOM.recipeCourse.value
    }
}

// toggle the custom unit input modal
export function toggleOtherUnitModal(val) {
    toggleUIComponent(DOM.customUnitModalContainer, val)
    toggleUIComponent(DOM.customUnitModal, val)
}

export function getOtherUnitData() {
    return {
        newUnit: DOM.customUnitInput.value,
        options: DOM.ingredientUnitInput.options
    }
}

// Closes the custom unit modal and resets the selection
export function cancelOtherUnit() {
    DOM.ingredientUnitInput.selectedIndex = 0;
    toggleOtherUnitModal(false);
}

// Insert the new unit into the dropdown if it doesn't already exist
export function addOtherUnitOption(unique) {
    if (unique) {
        let newOption = document.createElement("option");
        newOption.textContent = DOM.customUnitInput.value;
        DOM.ingredientUnitInput.insertBefore(newOption, DOM.otherUnitEntry);
    }
    DOM.ingredientUnitInput.value = DOM.customUnitInput.value;
    DOM.customUnitInput.value = "";
}

export function getImageInput() {
    return {
        localImage: DOM.imageInput,
        URL: DOM.imageURLInput
    }
}

export function initUI(addIngredientHandler, addRecipeHandler, addOtherUnitHandler) {
    DOM.ingredientUnitInput.addEventListener("change", function () {
        toggleOtherUnitModal(DOM.ingredientUnitInput.value === "Other")
    });
    DOM.addIngredientBtn.addEventListener("click", addIngredientHandler);
    DOM.submitRecipeBtn.addEventListener("click", addRecipeHandler);
    DOM.customUnitModalCancelBtn.addEventListener("click", cancelOtherUnit);
    DOM.customUnitModalAddBtn.addEventListener("click", addOtherUnitHandler);
}