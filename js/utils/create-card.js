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
    article.className = "card";
    article.innerHTML = `
    <p class="CourseType">${courseType}</p>
    <img class="RecipeImage" src="${image}" alt="${name}" loading="lazy">
    <p class="RecipeName">${name}</p>
    <p class="RecipeDescription">${description}</p>
    `;
    
    return article;
}
