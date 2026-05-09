from core.models import *
from admin_app.forms import *

class RecipeManager:
    _instance = None
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def addRecipeData(self, data, ingredients):
        '''
        Adds a recipe and its ingredients to the database
        '''
        recipe = Recipe.objects.create(**data)
        for ingredient in ingredients:
            ingredient_form = IngredientForm(ingredient)
            if ingredient_form.is_valid():
                if not Ingredient.objects.filter(name=ingredient_form.cleaned_data['name']).exists():
                    ingredient = Ingredient.objects.create(name=ingredient_form.cleaned_data['name'])
                    RecipeIngredient.objects.create(
                        recipe=recipe,
                        ingredient=ingredient,
                        quantity=ingredient_form.cleaned_data['quantity'],
                        unit=ingredient_form.cleaned_data['unit']
                    )
                
                
    def updateRecipeData(self, data, ingredients, recipe_id):
        '''
        updates a recipe's data in the database along with its ingredients
        '''
        recipe = Recipe.objects.get(id=recipe_id)
        for key, value in data.items():
            if value is not None:
                setattr(recipe, key, value)
        recipe.save()
            
        RecipeIngredient.objects.filter(recipe=recipe).delete()
        for ingredient in ingredients:
            ingredient_form = IngredientForm(ingredient)
            if ingredient_form.is_valid():
                if not Ingredient.objects.filter(name=ingredient_form.cleaned_data['name']).exists():
                    ingredient = Ingredient.objects.create(name=ingredient_form.cleaned_data['name'])
                else:
                    ingredient = Ingredient.objects.get(name=ingredient_form.cleaned_data['name'])
                RecipeIngredient.objects.create(
                    recipe=recipe,
                    ingredient=ingredient,
                    quantity=ingredient_form.cleaned_data['quantity'],
                    unit=ingredient_form.cleaned_data['unit']
                )
                
    def getRecipeData(self, recipe_id, request):
        '''
        fetches recipe data by its id
        returns recipe data along with its ingredients list
        '''
        recipe = Recipe.objects.get(id=recipe_id)
        ingredients = recipe.ingredients.all()
        recipeIngredient = RecipeIngredient.objects.filter(recipe=recipe)
        ingredient_data = []
        if recipe.image_file: image = request.build_absolute_uri(recipe.image_file.url)
        else: image = recipe.image_url
        for i in range(len(recipeIngredient)):
            ingredient = {
                "name": ingredients[i].name,
                "quantity": recipeIngredient[i].quantity,
                "unit": recipeIngredient[i].unit,
            }
            ingredient_data.append(ingredient)

        recipe_data = {
            "id": recipe.id,
            "name": recipe.name,
            "courseType": recipe.courseType,
            "description": recipe.description,
            "image": image,
            "ingredients": ingredient_data
        }
        return recipe_data
    

    def getAllRecipesData(self, request):
        '''
        returns recipe data by its id
        returns only the recipe data without its ingredients list
        '''
        all_recipe_data = []
        recipes = Recipe.objects.all()
        for i in range(len(recipes)):
            ingredients = recipes[i].ingredients.all()
            recipeIngredient = RecipeIngredient.objects.filter(recipe=recipes[i])
            ingredient_data = []
            for j in range(len(recipeIngredient)):
                ingredient = {
                    "name": ingredients[j].name,
                    "quantity": recipeIngredient[j].quantity,
                    "unit": recipeIngredient[j].unit
                }
                ingredient_data.append(ingredient)

            if recipes[i].image_file: image = request.build_absolute_uri(recipes[i].image_file.url)
            else: image = recipes[i].image_url
            all_recipe_data.append({
                "id": recipes[i].id,
                "name": recipes[i].name,
                "courseType": recipes[i].courseType,
                "description": recipes[i].description,
                "image": image,
                "ingredients": ingredient_data
            })
            
        return all_recipe_data
        
    def deleteRecipeData(self, recipe_id):
        '''
        deletes a recipe and its ingredients from the database
        '''
        Recipe.objects.filter(id=recipe_id).delete()
        
    def ingredient_search(self, query):
        result = Ingredient.objects.filter(name__startswith=query)
        return result