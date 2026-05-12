import { getRecipeById } from '/static/shared/database/db-recipes.js';
import { toggleFavourite, getUserFavourites } from '/static/shared/database/db-user.js';
import { DEFAULT_VALUES } from '/static/constants/recipe-constants.js';

const params = new URLSearchParams(window.location.search);
const recipeId = params.get('recipeid');

let recipe = await getRecipeById(recipeId);

const wrapper = document.getElementById('recipeContentWrapper');
const pageHeading = document.getElementById('pageHeading');

if (!recipe) {
    if (pageHeading) {
        pageHeading.textContent = 'Recipe not found';
        pageHeading.style.display = 'block';
    }
    if (wrapper) {
        wrapper.style.display = 'none';
        // what is this?
        // return;
    }
}

if (pageHeading) pageHeading.style.display = 'none';

if (wrapper) wrapper.style.display = 'block';

document.getElementById('recipeName').textContent = recipe.name;
document.getElementById('recipeImage').src = recipe.image || DEFAULT_VALUES.IMAGE;
document.getElementById('recipeImage').alt = recipe.name;
document.getElementById('course').textContent = recipe.courseType;
document.getElementById('recipeDescription').textContent = recipe.description;


const orderList = document.getElementById('ingredientList');
orderList.innerHTML = '';
for (const ingredient of recipe.ingredients) {
    const li = document.createElement('li');
    // #TODO: we should handle XSS injections here later but too busy rn 😭 
    li.innerHTML = `
        <span class="IngAmount">${ingredient.quantity} ${ingredient.unit}</span>
        <span class="IngName">${ingredient.name}</span>
    `;
    orderList.appendChild(li);
}
const favBtn = document.getElementById('favBtn');

async function updateFavBtn() {
    const favouriteResult = await getUserFavourites();
    const isSaved = favouriteResult.success&&favouriteResult.data.some(r => String(r.id)===String(recipeId));
    favBtn.classList.toggle('active',isSaved);
}
await updateFavBtn();
favBtn.addEventListener('click', async() => {
    favBtn.disabled = true;
    await toggleFavourite(recipeId);
    await updateFavBtn();
    favBtn.disabled = false;
    });
