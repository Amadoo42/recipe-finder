import { deleteRecipe } from "/static/shared/database/db-recipes.js";
import { createCard } from "/static/shared/utils/create-card.js";
import { setupSearch } from "/static/shared/utils/setup-search.js";
import { setupFilters } from "/static/shared/utils/setup-filters.js";
import { searchRecipes } from "/static/shared/database/db-recipes.js";
import { initHerbs } from "/static/shared/utils/favourites.js";

let currentQuery = "";
let currentSource = "all";
let currentCategory = "all";
let recipes = [];

/**
 * @brief this function initializes the recipes array from database
 * and sets up the search and filters
 */
function init() {
    setupSearch((query) => {
        currentQuery = query;
        updateView();
    });
    setupFilters((category) => {
        currentCategory = category;
        updateView();
    });
    updateView();
}

/**
 * @brief this is a wrapper function to get recipes and view them
 */
async function updateView() {
    let results = await searchRecipes(currentQuery, currentCategory);
    recipes = results.data;
    renderRecipes();
}

/**
 * @brief this function redirects the user to the edit page
 * @param {int} id 
 */
function editRecipe(id) {
    window.location.href = `/admin/add/?RecipeID=${id}&Edit=1`;
}
/**
 * @brief this function deletes a recipe of certain id
 * @param {int} id 
 */
function deleteRecipeView(id) {
    if (confirm("Are you sure you want to delete this recipe?")) {
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
        editBtn.innerHTML = '<span>✎</span> Edit';

        const deleteBtn = document.createElement('button');
        const span = document.createElement('span');
        deleteBtn.className = 'DeleteBtn';
        span.className = 'DeleteIcon';
        span.classList.add('material-symbols-rounded');
        span.textContent = 'delete';
        deleteBtn.append(span);

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editRecipe(recipe.id)
        });
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteRecipeView(recipe.id)
        });

        const subContainer = document.createElement('div');
        subContainer.className = 'buttons';
        subContainer.append(editBtn);
        subContainer.append(deleteBtn);

        const details = article.querySelector('.Details');
        details.append(subContainer);

        container.appendChild(article);
    });
}

init();
initHerbs();