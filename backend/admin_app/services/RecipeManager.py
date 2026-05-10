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
        if data['image_url']:
            data['image_file'] = None

        recipe = Recipe.objects.create(**data)

        recipe_ingredient_relations = []

        for ingredient in ingredients:
            ingredient_form = IngredientForm(ingredient)
            if ingredient_form.is_valid():
                ingredient, created = Ingredient.objects.get_or_create(name=ingredient_form.cleaned_data['name'])
                recipe_ingredient_obj = RecipeIngredient(
                    recipe=recipe,
                    ingredient=ingredient,
                    quantity=ingredient_form.cleaned_data['quantity'],
                    unit=ingredient_form.cleaned_data['unit']
                )
                recipe_ingredient_relations.append(recipe_ingredient_obj)
        if recipe_ingredient_relations:
            RecipeIngredient.objects.bulk_create(recipe_ingredient_relations)
                
                
    def updateRecipeData(self, data, ingredients, recipe_id):
        '''
        updates a recipe's data in the database along with its ingredients
        '''
        recipe = Recipe.objects.get(id=recipe_id)

        if data['image_url']:
            recipe.image_file = None
            data['image_file'] = None

        elif data['image_file'] and not data['image_url']:
            recipe.image_url = None
            data['image_url'] = None

        for key, value in data.items():
            if value is not None:
                setattr(recipe, key, value)
        recipe.save()

        recipe_ingredient_relations = []
            
        RecipeIngredient.objects.filter(recipe=recipe).delete()
        for ingredient in ingredients:
            ingredient_form = IngredientForm(ingredient)
            if ingredient_form.is_valid():
                ingredient, created = Ingredient.objects.get_or_create(name=ingredient_form.cleaned_data['name'])
                recipe_ingredient_obj = RecipeIngredient(
                    recipe=recipe,
                    ingredient=ingredient,
                    quantity=ingredient_form.cleaned_data['quantity'],
                    unit=ingredient_form.cleaned_data['unit']
                )
                recipe_ingredient_relations.append(recipe_ingredient_obj)

        if recipe_ingredient_relations:
            RecipeIngredient.objects.bulk_create(recipe_ingredient_relations)
                
    def getRecipeData(self, recipe_id, request):
        '''
        fetches recipe data by its id
        returns recipe data along with its ingredients list
        '''
        recipe = Recipe.objects.prefetch_related('recipe_ingredients__ingredient').get(id=recipe_id)
        
        ingredient_data = [
                {
                    "name": ri.ingredient.name,
                    "quantity": ri.quantity,
                    "unit": ri.unit,
                }
                for ri in recipe.recipe_ingredients.all()
            ]
        
        if recipe.image_file: image = request.build_absolute_uri(recipe.image_file.url)
        else: image = recipe.image_url

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
        recipes = Recipe.objects.prefetch_related('recipe_ingredients__ingredient').all()
        for recipe in recipes:
            recipe_ingredients = recipe.recipe_ingredients.all()
            ingredient_data = [
                {
                    "name": ri.ingredient.name,
                    "quantity": ri.quantity,
                    "unit": ri.unit,
                }
                for ri in recipe_ingredients
            ]
            if recipe.image_file: image = request.build_absolute_uri(recipe.image_file.url)
            else: image = recipe.image_url
            all_recipe_data.append({
                "id": recipe.id,
                "name": recipe.name,
                "courseType": recipe.courseType,
                "description": recipe.description,
                "image": image,
                "ingredients": ingredient_data
            })
        return all_recipe_data
        
        
    def deleteRecipeData(self, recipe_id):
        '''
        deletes a recipe and its ingredients from the database
        '''
        Recipe.objects.filter(id=recipe_id).delete()

    def getAllIngredients(self):
        result = Ingredient.objects.all()
        return result
        
    def ingredient_search(self, query):
        result = Ingredient.objects.filter(name__startswith=query)
        return result