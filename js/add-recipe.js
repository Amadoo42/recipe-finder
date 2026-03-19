class Recipe {
    constructor(name, course, description) {
        this.name = name;
        this.course = course;
        this.description = description;
        this.ingredients = [];
    }
}

class Ingredient {
    constructor(name, quantity, unit) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
    }
}

// this function is called whenever the user chooses an option in the ingredient unit drop list
// it checks if the user chose 'Other' and opens the prompt and take input from the user for the unit they want
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

    nameErrorMessage = document.getElementById("ingredientNameErrorMessage");
    const regex = /[^\p{L}\s]/u;
    if (regex.test(nameInput.value)) {
        nameErrorMessage.classList.add("show");
        return;
    }
    nameErrorMessage.classList.remove("show");

    quantity = Number(quantInput.value);
    quantityErrorMessage = document.getElementById("quantityErrorMessage");
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
function createRecipeObject() {
    const name = document.querySelector("input[name='recipe-name']").value;
    const course = document.querySelector("#course").value;
    const description = document.querySelector("textarea").value; 

    var recipe = new Recipe(name, course, description);
    const names = document.getElementsByClassName("IngredientName");
    const quantities = document.getElementsByClassName("IngredientQuantity");
    const units = document.getElementsByClassName("IngredientUnit");

    for (var i = 0; i < names.length; i++) {
        x = new Ingredient(names[i].textContent, quantities[i].textContent, units[i].textContent);
        recipe.ingredients.push(x)
    }

    jsonObject = JSON.stringify(recipe);
    console.log(jsonObject);
    alert("Added Recipe");
}