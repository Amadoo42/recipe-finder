/**
 * A recipe object used to render a recipe card.
 * @typedef {Object} Recipe
 * @property {string} courseType
 * @property {string|URL} image
 * @property {string} name
 * @property {string} decription
 */

/**
 * 
 * @param {Recipe} recipe
 * @returns {HTMLArticleElement} The created article element representing the recipe.
 */
export function createCard(recipe) {
    const {courseType, image, name, description} = recipe;

    const article = document.createElement('article');
    const id = `A${recipe.id}`;
    article.id = id;
    article.className = "card";

    const displayImage = image || '../assets/Egyptian-Koshari-1.jpg';

    article.innerHTML = `
    <p class="CourseType">${courseType}</p>
    <img class="RecipeImage" src="${displayImage}" alt="${name}" loading="lazy">
    <p class="RecipeName">${name}</p>
    <p class="RecipeDescription">${description}</p>
    `;
    
    article.addEventListener('click', (e) => {
        const targetUrl = new URL('../user/recipe_details.html', window.location.href);
        targetUrl.searchParams.set('recipeid', recipe.id);
        window.location.href = targetUrl.toString();
    });

    return article;
}
