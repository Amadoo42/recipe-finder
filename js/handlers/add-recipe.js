import {createRecipeObject, createIngredientObject} from "../utils/schema-factories.js";
import {addRecipe} from "../database/db-recipes.js";

document.getElementById("unit").addEventListener("change", handleOtherUnit);
document.getElementById("addIngredient").addEventListener("click", addNewIngredient);
document.getElementById("cancelCustomUnit").addEventListener("click", cancelOtherUnit);
document.getElementById("addCustomUnit").addEventListener("click", addOtherUnit);
document.getElementById("addRecipe").addEventListener("click", addRecipeHandler);

function handleOtherUnit() {
    const unitInput = document.getElementById("unit");
    if (unitInput.value == "Other") {
        const customUnitContainer = document.getElementById("customUnitCotainer");
        customUnitContainer.classList.add("show");
        const customUnitPrompt = document.getElementById("customUnitPrompt");
        customUnitPrompt.classList.add("show");
    }
}

// this function is called inside the prompt for adding a new ingredient unit
// it gets the user input, makes sure it's not already there (not case sensitive) and adds it to the drop list right before the 'Other' option
function addOtherUnit() {
    const unitInput = document.getElementById("unit");
    const unit = document.querySelector("input[name='custom-unit']").value;
    const customUnitPrompt = document.getElementById("customUnitPrompt");
    const customUnitContainer = document.getElementById("customUnitCotainer");
    var isThere = false;

    const unitErrorMessage = document.getElementById("customUnitErrorMessage");
    const regex = /[^\p{L}\s]/u;
    if (regex.test(unit)) {
        unitErrorMessage.classList.add("show");
        return;
    }
    unitErrorMessage.classList.remove("show");

    for (var option of unitInput.options) {
        if (option.value.toLowerCase() === unit.toLowerCase()) {
            isThere = true;
            false;
        }
    }
    if (unit && !isThere) {
        const otherUnit = document.getElementById("otherUnit")
        var newOption = document.createElement("option");
        newOption.innerHTML = unit;
        unitInput.insertBefore(newOption, otherUnit);
        unitInput.value = unit;        
    }
    else {
        unitInput.value = "Cups";
    }
    customUnitPrompt.classList.remove("show");
    customUnitContainer.classList.remove("show");
}

// this function is called when the user presses cancel inside the prompt for adding a new ingredient unit
function cancelOtherUnit() {
    const unitInput = document.getElementById("unit");
    const customUnitPrompt = document.getElementById("customUnitPrompt");
    const customUnitContainer = document.getElementById("customUnitCotainer");
    unitInput.value = "Cups";
    customUnitPrompt.classList.remove("show");
    customUnitContainer.classList.remove("show");
}

// this function is called when the user adds a new ingredient
// it checks if the input is valid and adds a new entry in the ingredient list
function addNewIngredient() {
    const list = document.querySelector("#ingredientList");
    const nameInput = document.querySelector("#ingredientName");
    const quantInput = document.querySelector("#quantity");
    const unitInput = document.querySelector("#unit");

    const nameErrorMessage = document.getElementById("ingredientNameErrorMessage");
    const quantityErrorMessage = document.getElementById("quantityErrorMessage");

    nameErrorMessage.classList.remove("show");
    quantityErrorMessage.classList.remove("show");

    const regex = /[^\p{L}\s]/u;
    if (regex.test(nameInput.value)) {
        nameErrorMessage.classList.add("show");
        return;
    }
    nameErrorMessage.classList.remove("show");

    const quantity = Number(quantInput.value);
    if (isNaN(quantity) || quantity <= 0) {
        quantityErrorMessage.classList.add("show");
        return;
    }
    quantityErrorMessage.classList.remove("show");
    if (!nameInput.value || !quantInput.value) return;


    const item = document.createElement("li");
    item.className = "IngredientListItem";

    item.innerHTML = `
        <div class="ItemContainer">
            <p class="IngredientName">${nameInput.value}</p>
            <div>
                <p class="IngredientQuantity">${quantity}</p>
                <p class="IngredientUnit">${unitInput.value}</p>
            </div>
        </div>
        <button class="DeleteBtn">X</button>
    `;

    item.querySelector(".DeleteBtn").addEventListener("click", function() { item.remove() });
    list.appendChild(item);

    nameInput.value = "";
    quantInput.value = "";
    unitInput.value = "Cup";
}

// this function is called when the user presses 'Add Recipe'
// it gets all the input in all fields and creates a new Recipe object
// it then converts that object to JSON
// javascript doesn't allow retrieving the path of a file
// this function saves the image data as base64 string and stores in the database
// to load it in another page set src="base64String"
async function addRecipeHandler() {
    const name = document.querySelector("input[name='recipe-name']").value;
    const course = document.querySelector("#course").value;
    const description = document.querySelector("textarea").value; 

    const names = document.getElementsByClassName("IngredientName");
    const quantities = document.getElementsByClassName("IngredientQuantity");
    const units = document.getElementsByClassName("IngredientUnit");
    const imageSelector = document.getElementById("imageSelector");
    var ingredients = []
    var imageData = "";

    const toBase64 = file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });
    imageData = await toBase64(imageSelector.files[0]);    

    for (var i = 0; i < names.length; i++) {
        const ingredient = createIngredientObject(names[i].textContent, quantities[i].textContent, units[i].textContent);
        ingredients.push(ingredient);
    }

    var recipe = createRecipeObject(name, description, course, ingredients, imageData);
    addRecipe(recipe);

    // jsonObject = JSON.stringify(recipe);
    // console.log(jsonObject);
    alert("Added Recipe");
}