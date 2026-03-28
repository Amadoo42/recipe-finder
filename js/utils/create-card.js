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
 * @param {function} onClick - callback fired when the card is clicked.
 * @returns {HTMLArticleElement} The created article element representing the recipe.
 */
export function createCard(recipe, onClick) {
    const {courseType, image, name, description} = recipe;

    const article = document.createElement('article');
    const id = `A${recipe.id}`;
    article.id = id;
    article.className = "card";
    
    article.innerHTML = `
    <p class="CourseType">${courseType}</p>
    <img class="RecipeImage" src="${image}" alt="${name}" loading="lazy">
    <p class="RecipeName">${name}</p>
    <p class="RecipeDescription">${description}</p>
    `;
    
    article.addEventListener('click', (e) => {
        if(onClick) onClick(e);
    });
    
    return article;
}
