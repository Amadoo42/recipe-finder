import { createCard } from "/static/shared/utils/create-card.js";
import { toggleFavourite, getUserFavourites } from "/static/shared/database/db-user.js";
import { searchRecipes } from "/static/shared/utils/search-recipes.js";
import { setupSearch } from "/static/shared/utils/setup-search.js";
import { setupFilters } from "/static/shared/utils/setup-filters.js";
import { fillHerbs } from "/static/shared/utils/favourites.js";

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
function handleFavorites(id) {
    toggleFavourite(id);
}

/**
 * @brief displays all recipe cards
 */
function renderRecipes() {
    const container = document.getElementById('main');
    container.innerHTML = "";

    const favouritesResult = getUserFavourites();
    const favIds = favouritesResult.success ? favouritesResult.data.map(r => String(r.id)) : [];

    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const card = createCard(recipe);
        const isFavourited = favIds.includes(String(recipe.id));

        const favBtn = document.createElement('button');
        favBtn.className = 'FavBtn';

        favBtn.innerHTML = `<span class="material-symbols-rounded">favorite</span>`;

        if (isFavourited) favBtn.classList.add('active');

        card.appendChild(favBtn);

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleFavorites(recipe.id);

            favBtn.classList.toggle('active');
        });

        container.appendChild(card);
    })
}

init();
fillHerbs();
window.addEventListener('resize', fillHerbs);