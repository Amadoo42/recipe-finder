from core.models import *
from admin_app.forms import *
from django.shortcuts import get_object_or_404

class RecipeManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def addRecipeData(self, data, ingredients):
        '''
        Adds a recipe and ingredients to the database
        '''
        recipe = Recipe.objects.create(**data)
        for ingredient in ingredients:
            ingredient_form = IngredientForm(ingredient)
            if ingredient_form.is_valid():
                if not Ingredient.objects.filter(name=ingredient_form.cleaned_data['name']).exists():
                    Ingredient.objects.create(recipe=recipe, **ingredient_form.cleaned_data)
                
                
    def updateRecipeData(self, data, ingredients, recipe_id):
        '''
        updates a recipe's data in the database along with its ingredients
        '''
        Recipe.objects.filter(id=recipe_id).update(**data)
        recipe = Recipe.objects.get(id=recipe_id)
            
        Ingredient.objects.filter(recipe_id=recipe_id).delete()
        for ingredient in ingredients:
            ingredient_form = IngredientForm(ingredient)
            if ingredient_form.is_valid():
                Ingredient.objects.create(recipe=recipe, **ingredient_form.cleaned_data)
                
    def getRecipeData(self, recipe_id):
        '''
        fetches recipe data by its id
        returns recipe data along with its ingredients list
        '''
        recipe = Recipe.objects.get(id=recipe_id)
        ingredients = Ingredient.objects.filter(recipe_id=recipe_id)
        return recipe, ingredients
    
    
    def getAllRecipesData(self):
        '''
        returns recipe data by its id
        returns only the recipe data without its ingredients list
        '''
        recipes = Recipe.objects.all()
        return recipes
        
    def deleteRecipeData(self, recipe_id):
        '''
        deletes a recipe and its ingredients from the database
        '''
        Recipe.objects.filter(id=recipe_id).delete()
        
    def ingredient_search(self, query):
        result = Ingredient.objects.filter(name__startswith=query)
        return result