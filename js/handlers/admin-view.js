import { getRecipes, deleteRecipe } from "../database/db-recipes.js";
import { createCard } from "../utils/create-card.js";

let recipes = [];

/**
 * @brief this function initilizes the recipes array from database
 */
function init() {
    recipes = getRecipes();
}

/**
 * @brief this function redirects the user to the edit page
 * @param {int} id 
 */
function editRecipe(id){
    window.location.href = `add-recipe.html?RecipeID=${id}&Edit=1`;
}

/**
 * @brief this function deletes a recipe of certain id
 * @param {int} id 
 */
function deleteRecipeView(id){
    if(confirm("Do you want to marry me?<3")){
        const article = document.getElementById(`A${id}`);
        article.remove();
        deleteRecipe(id);
    }
}

/**
 * @brief this handles the rendering of each recipe card
 */
function renderRecipes() {
    const container = document.getElementById('main');
    container.innerHTML = "";
    recipes.forEach(recipe => {
        const article = createCard(recipe);
        
        const editBtn = document.createElement('button');
        editBtn.className = 'EditBtn';
        editBtn.innerText = 'Edit';
        article.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'DeleteBtn';
        deleteBtn.innerText = 'Delete';
        article.appendChild(deleteBtn);

        editBtn.addEventListener('click', () => editRecipe(recipe.id));
        deleteBtn.addEventListener('click', () => deleteRecipeView(recipe.id));

        container.appendChild(article);
    });
}

init();
renderRecipes();