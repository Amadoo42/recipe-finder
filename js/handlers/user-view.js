import { createCard } from "../utils/create-card.js";
import { toggleFavourite } from "../database/db-user.js";
import { searchRecipes } from "../utils/search-recipes.js";

let currentQuery = "";
let currentSource = "all";
let currentCategory = "all";
let recipes = [];

/**
 * @brief Initializes the user view 
 */
function init() {
    setupSearch();
    setupFilters();
    applySearchAndFilter();
}

/**
 * @brief Sets up event listeners for the search input and button
 */
function setupSearch() {
    const input = document.querySelector('#search input');
    const button = document.querySelector('#search button');

    button.addEventListener('click', () => {
        currentQuery = input.value;
        applySearchAndFilter();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            currentQuery = input.value;
            applySearchAndFilter();
        }
    });
}

/**
 * @brief Sets up event listeners for the filter buttons
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('#filters button');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentCategory = btn.textContent.trim();
            applySearchAndFilter();
        });
    });
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
        card.addEventListener('click', (e) => { if(!e.target.classList.contains('FavBtn'))viewRecipe(recipe.id)});

        container.appendChild(card);
    })
}

init();