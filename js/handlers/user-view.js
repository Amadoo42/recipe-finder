import { createCard } from "../utils/create-card.js";
import { toggleFavourite } from "../database/db-user.js";
import { searchRecipes } from "../utils/search-recipes.js";
import { setupSearch } from "../utils/setup-search.js";
import { setupFilters } from "../utils/setup-filters.js";

let currentQuery = "";
let currentSource = "all";
let currentCategory = "all";
let recipes = [];

/**
 * @brief Initializes the user view 
 */
function init() {
    setupSearch((query) => {
        currentQuery = query;
        applySearchAndFilter();
    });
    setupFilters((category) => {
        currentCategory = category;
        applySearchAndFilter();
    });
    applySearchAndFilter();
}

/**
 * @brief Applies the current search query and filter settings to update the displayed recipes
 */
function applySearchAndFilter() {
    let results = searchRecipes(currentQuery, currentSource, currentCategory);
    recipes = results.data;

    renderRecipes();
}

/**
 * @brief toggles the favourite status of a recipe
 * @param {number} id 
 */
function handleFavorites(id){
    toggleFavourite(id);
}

/**
 * @brief Redirects the user to the recipe details page
 * @param {number} id 
 */
function viewRecipe(id){
    window.location.href = `recipe_details.html?recipeid=${id}`;
}

/**
 * @brief displays all recipe cards
 */
function renderRecipes(){
    const container = document.getElementById('main');
    container.innerHTML = "";

    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const card = createCard(recipe);

        const favBtn = document.createElement('button');
        favBtn.className = 'FavBtn';
        favBtn.innerText = 'Add to Favourites';
        card.appendChild(favBtn);

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleFavorites(recipe.id);
        });
        
        container.appendChild(card);
    })
}

init();