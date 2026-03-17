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

var initalized = false;

function addIngredient() {
    const list = document.querySelector("#ingredient-list");

    const nameInput = document.querySelector("#ingredient-name");
    const quantInput = document.querySelector("#quantity");
    const unitInput = document.querySelector("#unit");

    if (!nameInput.value || !quantInput.value) return;

    const item = document.createElement("li");
    item.className = "ingredient-list-item";

    item.innerHTML = `
        <div class="item-container">
            <p class="ingredient-name">${nameInput.value}</p>
            <div>
                <p class="ingredient-quantity">${quantInput.value}</p>
                <p class="ingredient-unit">${unitInput.value}</p>
            </div>
        </div>
        <button class="delete-btn">X</button>
    `;

    item.querySelector(".delete-btn").addEventListener("click", function(){item.remove()});
    list.appendChild(item);

    nameInput.value = "";
    quantInput.value = "";
    unitInput.value = "Cup";
}

function createRecipeObject() {
    const name = document.querySelector("input[name='recipe-name']").value;
    const course = document.querySelector("#course").value;
    const description = document.querySelector("textarea").value; 

    var recipe = new Recipe(name, course, description);
    const names = document.getElementsByClassName("ingredient-name");
    const quantities = document.getElementsByClassName("ingredient-quantity");
    const units = document.getElementsByClassName("ingredient-unit");

    for (var i = 0; i < names.length; i++) {
        x = new Ingredient(names[i].textContent, quantities[i].textContent, units[i].textContent);
        recipe.ingredients.push(x)
    }

    jsonObject = JSON.stringify(recipe);
    console.log(jsonObject);
    alert("Added Recipe");
}