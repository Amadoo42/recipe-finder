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
    course: "Appetizers",
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

const queryString = window.location.search;

const params = new URLSearchParams(queryString);

const recipeID = params.get("RecipeID") - 1;
const isEdit = params.get("Edit");

//this function is used to initilize the recipe array
//function needs is getRecipes which returns an array containing recipe objects
function init() {
    //getRecipes();
}

function editHtml() {
    const header = document.getElementById("recipe");
    header.innerText = "Edit Recipe";

    const button = document.getElementById("add-recipe");
    button.innerText = "Save";
}

function loadRecipe(){
    const inputName = document.getElementById("recipe-name");
    inputName.value = `${recipes[recipeID].name}`;

    const selectName = document.getElementById("course");
    selectName.value = `${recipes[recipeID].course}`;

    const description = document.getElementById("description");
    description.value = recipes[recipeID].description;

    const ingredients = document.getElementById("ingredient-list");
    ingredients.innerHTML = "";

    recipes[recipeID].ingredients.forEach(ingredient => {
        const item = document.createElement("li");
        const name = ingredient.name;
        const quantity = ingredient.quantity;
        const unit = ingredient.unit;

        item.innerHTML = `
        <div class="item-container">
            <p class="ingredient-name" style="color: black;">${name}</p>
            <div>
                <p class="ingredient-quantity">${quantity}</p>
                <p class="ingredient-unit">${unit}</p>
            </div>
        </div>
        <button class="delete-btn">X</button>
        `;
        item.querySelector(".delete-btn").addEventListener("click", function(){item.remove()});
        ingredients.appendChild(item);
    });
}

if(isEdit){
    editHtml();
    loadRecipe();
}
