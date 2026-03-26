/**
 * 
 * @param {object} recipe 
 * @returns this creates an article (recipe card)
 */
export function createCard(recipe) {
    const {courseType, image, name, description} = recipe;

    const article = document.createElement('article');
    article.className = "card";
    article.innerHTML = `
    <p class="CourseType">${courseType}</p>
    <img class="RecipeImage" src="${image}">
    <p class="RecipeName">${name}</p>
    <p class="RecipeDescription">${description}</p>
    `;
    
    return article;
}