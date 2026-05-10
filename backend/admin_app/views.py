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
    body = json.loads(request.body)
    id = int(body.get('id'))
    
    recipe_manager.deleteRecipeData(id)
    return JsonResponse({
            "success": True
    })

def add(request):
    return render(request, 'add-recipe.html')
    

def get_recipe_by_id(request):
    recipe_id = request.GET.get('RecipeID')
    recipe_data = recipe_manager.getRecipeData(recipe_id, request)
    return JsonResponse({
            "success": True,
            "recipe": recipe_data
    })

def get_all_recipes(request):
    all_recipe_data = recipe_manager.getAllRecipesData(request)
    return JsonResponse({
        "success": True,
        "recipes": all_recipe_data
    })
    
def get_all_ingredients(request):
    ingredients = recipe_manager.getAllIngredients()
    return JsonResponse({
        "success": True,
        "ingredients": list(ingredients.values('name'))
    })