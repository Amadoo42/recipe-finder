from django.shortcuts import render
from .forms import *
from django.http import JsonResponse
from core.models import *
from .services import *

recipe_manager = RecipeManager()

def dashboard(request):
    return render(request, 'dashboard.html')

def explore(request):
    return render(request, 'view-recipe.html')

def add(request):
    return render(request, 'add-recipe.html')

def add_other_unit(request):
    form = OtherUnitForm(request.POST)
    return validateForm(form)
        
def add_ingredient(request):
    form = IngredientForm(request.POST)
    return validateForm(form)

def add_recipe(request):
    form = RecipeForm(request.POST, request.FILES)
    return validateRecipeForm(request, form, recipe_manager.addRecipeData)

def update_recipe(request):
    form = RecipeForm(request.POST, request.FILES)
    recipe_id = request.POST.get('recipe_id', None)
    return validateRecipeForm(request, form, recipe_manager.updateRecipeData, recipe_id)

def delete_recipe(request):
    ...

def add(request):
    return render(request, 'add-recipe.html')
    

def get_recipe_by_id(request):
    recipe_id = request.GET.get('RecipeID')
    recipe, ingredient_data = recipe_manager.getRecipeData(recipe_id)
    return JsonResponse({
            "success": True,
            "recipe": {
                "id": recipe.id,
                "name": recipe.name,
                "courseType": recipe.courseType,
                "description": recipe.description,
            },
            "ingredients": ingredient_data
    })

def get_all_recipes(request):
    all_recipe_data = recipe_manager.getAllRecipesData()
    return JsonResponse({
            "success": True,
            "recipes": all_recipe_data
    })
    
def search_ingredient(request):
    query = request.GET.get('query', '')
    suggestions = recipe_manager.ingredient_search(query)
    return JsonResponse({
        "success": True,
        "ingredients": list(suggestions.values('id', 'name', 'quantity', 'unit'))
    })