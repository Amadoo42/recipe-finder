import * as CONST from '/static/constants/recipe-constants.js'

// A centralized object containing references to all required HTML elements
const DOM = {
    // HEADER
    header: document.getElementById('recipe'),

    // RECIPE INPUT
    recipeName: document.querySelector("input[name='recipe-name']"),
    recipeCourse: document.getElementById("course"),
    recipeDescription: document.getElementById("description"),

    // INGREDIENT LIST VALUES
    ingredientList: document.getElementById("ingredientList"),
    ingredientListNames: document.getElementsByClassName("IngredientName"),
    ingredientListQuantities: document.getElementsByClassName("IngredientQuantity"),
    ingredientListUnits: document.getElementsByClassName("IngredientUnit"),

    // INGREDIENT INPUT
    ingredientNameInput: document.querySelector("#ingredientName"),
    ingredientSuggestionsList: document.querySelector("#ingredientSuggestionsList"),
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

export const INGREDIENT_ERROR_MESSAGES = {
    "name": document.getElementById("ingredientNameErrorMessage"),
    "quantity": document.getElementById("quantityErrorMessage"),
}

export const OTHER_ERROR_MESSAGES = {
    "unit": document.getElementById("customUnitErrorMessage"),
}

export const RECIPE_ERROR_MESSAGES = {
    "name": document.getElementById("recipeNameErrorMessage"),
    "description": document.getElementById("recipeDescriptionErrorMessage"),
    "image_url": document.getElementById("imageURLErrorMessage"),
}


// Toggle the visibility of an element using the 'show' css class
export function toggleUIComponent(component, value) {
    component.classList.toggle(CONST.CSS_CLASSES.SHOW, value);
}

export function renderHeader(isEdit) {
    DOM.header.textContent = isEdit ? CONST.TEXT_VALUES.EDIT.HEADER : CONST.TEXT_VALUES.CREATE.HEADER;
    DOM.submitRecipeBtn.textContent = isEdit ? CONST.TEXT_VALUES.EDIT.SUBMIT_BUTTON : CONST.TEXT_VALUES.CREATE.SUBMIT_BUTTON;
}

export function renderRecipeDetails(name, course, description) {
    DOM.recipeName.value = name;
    DOM.recipeCourse.value = course;
    DOM.recipeDescription.value = description;
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

export function resetIngredientSuggestions() {
    DOM.ingredientSuggestionsList.innerHTML = "";
}

export function renderIngredientSuggestions(suggestions) {
    resetIngredientSuggestions();
    if (!suggestions) return;
    for (const item of suggestions) {
        const li = document.createElement('li');
        li.addEventListener('click', () => {
            DOM.ingredientNameInput.value = li.textContent;
            renderIngredientSuggestions();
        });
        li.textContent = item;
        DOM.ingredientSuggestionsList.appendChild(li);
    }
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
        courseType: DOM.recipeCourse.value
    }
}

// toggle the custom unit input modal
export function toggleOtherUnitModal(val) {
    toggleUIComponent(DOM.customUnitModalContainer, val)
    toggleUIComponent(DOM.customUnitModal, val)
}

export function getOtherUnitData() {
    return {
        unit: DOM.customUnitInput.value
    }
}

// Closes the custom unit modal and resets the selection
export function cancelOtherUnit() {
    DOM.ingredientUnitInput.selectedIndex = 0;
    toggleOtherUnitModal(false);
}

// Insert the new unit into the dropdown if it doesn't already exist
export function addOtherUnitOption(unit) {
    let unique = true;
    const unitsOptions = DOM.ingredientUnitInput.options;
    for (let option of unitsOptions) {
        if (option.value.toLowerCase() === unit.toLowerCase()) {
            unique = false;
            break;
        }
    }

    if (unique) {
        let newOption = document.createElement("option");
        newOption.textContent = DOM.customUnitInput.value;
        DOM.ingredientUnitInput.insertBefore(newOption, DOM.otherUnitEntry);
    }
    DOM.ingredientUnitInput.value = unit;
    DOM.customUnitInput.value = "";
}

export function getImageInput() {
    return {
        image_file: DOM.imageInput.files[0],
        image_url: DOM.imageURLInput.value
    }
}

export function initUI(addIngredientHandler, addRecipeHandler, addOtherUnitHandler, ingredientSearch) {
    DOM.ingredientUnitInput.addEventListener("change", function () {
        toggleOtherUnitModal(DOM.ingredientUnitInput.value === "Other")
    });
    DOM.addIngredientBtn.addEventListener("click", addIngredientHandler);
    DOM.submitRecipeBtn.addEventListener("click", async () => {
        DOM.submitRecipeBtn.disabled = true;
        DOM.submitRecipeBtn.textContent = "Processing the request...";
        await addRecipeHandler();
        renderHeader();
    });
    DOM.customUnitModalCancelBtn.addEventListener("click", cancelOtherUnit);
    DOM.customUnitModalAddBtn.addEventListener("click", addOtherUnitHandler);
    DOM.ingredientNameInput.addEventListener('input', ingredientSearch)

    // hide the suggestions list when clicking anywhere in the page but the input field or the list itself
    document.addEventListener('click', (e) => {
    if (!DOM.ingredientNameInput.contains(e.target) && !DOM.ingredientSuggestionsList.contains(e.target)) {
        DOM.ingredientSuggestionsList.style.display = 'none';
    }
    else if (DOM.ingredientNameInput.contains(e.target)) {
        DOM.ingredientSuggestionsList.style.display = 'block';
    }
});
}