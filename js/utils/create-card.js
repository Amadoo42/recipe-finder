/**
 * 
 * @param {string} courseType 
 * @param {url} image 
 * @param {string} name 
 * @param {string} description 
 * @returns an article element (recipe card)
 */
export function createCard(courseType, image, name, description) {
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