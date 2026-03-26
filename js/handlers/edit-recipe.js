import { getRecipeById, getRecipes } from "../database/db-recipes.js";
import { sharedData } from "./add-recipe/shared-data.js";

/*
This block of code reads the url and sees if it is edit page
and initializes the recipe
*/
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const recipeID = params.get('RecipeID');
const isEdit = params.get('Edit');

let recipe = getRecipeById(recipeID);

/**
 * @brief this only edits the html to make it edit page
 */
function editHtml() {
    const header = document.getElementById('recipe');
    header.innerText = 'Edit Recipe';

    const button = document.getElementById('addRecipe');
    button.innerText = 'Save';
}

/**
 * @brief this loads the form with recipe details
 */
function loadRecipe() {
    const inputName = document.getElementById('recipeName');
    inputName.value = `${recipe.name}`;

    const selectName = document.getElementById('course');
    selectName.value = `${recipe.courseType}`;

    const description = document.getElementById('description');
    description.value = recipe.description;

    const ingredients = document.getElementById('ingredientList');
    ingredients.innerHTML = '';

    recipe.ingredients.forEach((ingredient) => {
        const item = document.createElement('li');
        const name = ingredient.name;
        const quantity = ingredient.quantity;
        const unit = ingredient.unit;

        item.innerHTML = `
            <div class="ItemContainer">
            <p class="IngredientName">${name}</p>
            <div>
                <p class="IngredientQuantity">${quantity}</p>
                <p class="IngredientUnit">${unit}</p>
            </div>
        </div>
        <button class="DeleteBtn">X</button>
        `;

        item.querySelector('.DeleteBtn').addEventListener(
            'click',
            function () {
                item.remove();
            },
        );

        ingredients.appendChild(item);
    });
    sharedData.imageLoadedData = recipe.image;
    sharedData.isEdit = isEdit;
    sharedData.recipeID = recipeID;
    sharedData.ingredients = recipe.ingredients;
}

if (isEdit) {
    editHtml();
    loadRecipe();
}
