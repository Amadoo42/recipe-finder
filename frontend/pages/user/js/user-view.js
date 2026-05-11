import { createCard } from "/static/shared/utils/create-card.js";
import { toggleFavourite, getUserFavourites } from "/static/shared/database/db-user.js";
import { searchRecipes } from "/static/shared/database/db-recipes.js";
import { setupSearch } from "/static/shared/utils/setup-search.js";
import { setupFilters } from "/static/shared/utils/setup-filters.js";
import { initHerbs } from "/static/pages/user/js/favourites.js";

let currentQuery = "";
let currentCategory = "all";
let recipes = [];
let requestId = 0;

/**
 * @brief toggles the favourite status of a recipe
 * @param {number} id 
*/
async function handleFavorites(id) {
    await toggleFavourite(id);
}

/**
 * @brief displays all recipe cards
*/
async function renderRecipes() {
    const container = await document.getElementById('main');
    container.innerHTML = "";
    
    const favouritesResult = await getUserFavourites();
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
        
        favBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            favBtn.disabled = true;
            await handleFavorites(recipe.id);
            favBtn.classList.toggle('active');
            favBtn.disabled = false;
        });
        
        container.appendChild(card);
    })
}

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
async function applySearchAndFilter() {
    const thisRequest = ++requestId;
    let results = await searchRecipes(currentQuery, currentCategory);
    if (thisRequest !== requestId) return;
    if (results.success && Array.isArray(results.data)) {
        recipes = results.data;
    } else {
        recipes = [];
        if (results.description) {
            console.error(results.description);
        }
    }
    await renderRecipes();
}
init();
initHerbs();