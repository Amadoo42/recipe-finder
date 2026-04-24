import { toggleFavourite } from '../../../shared/database/db-user.js'
import { filterRecipesByCategory } from '../../../shared/utils/filter-recipes.js';
import { createCard } from '../../../shared/utils/create-card.js';

let currentCategory = 'all';

function updateCategoryCounts() {
    const response = filterRecipesByCategory('all', 'favourites');
    const allFavouriteRecipes = response.success ? response.data : [];

    let counts = {
        'all': allFavouriteRecipes.length,
        'main': 0,
        'appetizers': 0,
        'dessert': 0
    };

    allFavouriteRecipes.forEach(recipe => {
        const type = recipe.courseType.toLowerCase();
        if (counts[type] !== undefined) counts[type]++;
    });

    document.getElementById('countAll').textContent = counts['all'];
    document.getElementById('countMain').textContent = counts['main'];
    document.getElementById('countAppetizer').textContent = counts['appetizers'];
    document.getElementById('countDessert').textContent = counts['dessert'];
}

function renderFavourite(category = 'all') {
    currentCategory = category;
    const grid = document.getElementById('main');//put the id of grid
    const state = document.getElementById('fav-empty');//put the state if empty or not

    const respond = filterRecipesByCategory(category, 'favourites');

    grid.innerHTML = '';

    updateCategoryCounts();

    if (!respond.success || !respond.data || respond.data.length == 0) {
        grid.style.display = 'none';
        state.style.display = '';
        return;
    }

    const recipes = respond.data;

    grid.style.display = '';
    state.style.display = 'none';

    for (const recipe of recipes) {
        const card = createCard(recipe);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'FavBtn';
        deleteBtn.innerHTML = `<span class="material-symbols-rounded">favorite</span>`;

        deleteBtn.addEventListener('click', (e) => { toggleFavourite(recipe.id); renderFavourite(currentCategory); e.stopPropagation(); });
        card.appendChild(deleteBtn);
        grid.appendChild(card);
    }

    updateCategoryCounts(recipes);
}


if (document.getElementById('countAll')) {
    renderFavourite('all');

    document.querySelectorAll('.FilterBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.FilterBtn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderFavourite(btn.dataset.category);
        });
    });
}

export function fillHerbs() {
    const herbs = ['../assets/origano.svg', '../assets/basil.svg'];
    const cols = [document.getElementById('herbLeft'), document.getElementById('herbRight')];

    cols.forEach((col) => {
        col.innerHTML = '';
        const availableHeight = window.innerHeight - 300; // matches calc above
        const imgHeight = 110 + 12; // img width + gap
        const slots = Math.ceil(availableHeight / imgHeight) + 1;

        for (let i = 0; i < slots; i++) {
            const img = document.createElement('img');
            img.src = herbs[i % 2];
            img.alt = '';
            col.appendChild(img);
        }
    });
}

fillHerbs();
window.addEventListener('resize', fillHerbs);
