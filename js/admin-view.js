const recipes = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    course: "Main",
    description: "A juicy beef patty topped with melted cheddar cheese, lettuce, and tomato.",
    ingredients: [
      {
        name: "Beef patty",
        quantity: 1,
        unit: "piece"
      },
      {
        name: "Cheddar cheese",
        quantity: 2,
        unit: "slices"
      },
      {
        name: "Hamburger bun",
        quantity: 1,
        unit: "piece"
      }
    ]
  },
  {
    id: 2,
    name: "Caesar Salad",
    course: "Starter",
    description: "Crisp romaine lettuce tossed in Caesar dressing, topped with croutons and parmesan.",
    ingredients: [
      {
        name: "Romaine lettuce",
        quantity: 2,
        unit: "cups"
      },
      {
        name: "Caesar dressing",
        quantity: 3,
        unit: "tablespoons"
      },
      {
        name: "Parmesan cheese",
        quantity: 0.5,
        unit: "cup"
      }
    ]
  },
  {
    id: 3,
    name: "Pizza",
    course: "Main",
    description: "Classic Margherita pizza with a thick crust, tomato sauce, and mozzarella.",
    ingredients: [
      {
        name: "Pizza dough",
        quantity: 1,
        unit: "piece"
      },
      {
        name: "Mozzarella cheese",
        quantity: 2,
        unit: "cups"
      },
      {
        name: "Tomato sauce",
        quantity: 0.5,
        unit: "cup"
      }
    ]
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    course: "Dessert",
    description: "Warm chocolate cake with a gooey, molten chocolate center.",
    ingredients: [
      {
        name: "Dark chocolate",
        quantity: 100,
        unit: "grams"
      },
      {
        name: "Butter",
        quantity: 0.5,
        unit: "cup"
      },
      {
        name: "Sugar",
        quantity: 3,
        unit: "tablespoons"
      }
    ]
  }
];
//note id is int

//this function is used to initilize the recipe array
//function needs is getRecipes which returns an array containing recipe objects
function init() {
    //getRecipes();
}

function editRecipe(id){
    window.location.href = `add-recipe.html?RecipeID=${id}&Edit=1`;
}

//this function is used to delete a recipe from UI and DB
//this function needs a deleteRecipe(id) function that delete recipe of "id" in the database
function deleteRecipe(id){
    if(confirm("Do you want to marry me?<3")){
        const article = document.getElementById(id);
        article.remove();
        //deleteRecipe(id);
    }
}

function renderRecipes() {
    const container = document.getElementById('Main');
    container.innerHTML = "";
    recipes.forEach(recipe => {
        const article = document.createElement('article');
        const id = `A${recipe.id}`;
        article.id = id;

        article.innerHTML = `
            <img src="${recipe.image}">
            <p>${recipe.name}</p>
            <p>${recipe.description}</p>
            <div>
                <button onclick = "editRecipe(${recipe.id})">Edit</button>
                <button onclick = "deleteRecipe('${id}')">Delete</button>
            </div>
        `;
        container.appendChild(article);
    });
}

init();
renderRecipes();