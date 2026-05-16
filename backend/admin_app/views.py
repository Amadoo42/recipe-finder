import json
from django.shortcuts import render
from .forms import OtherUnitForm, IngredientForm, RecipeForm
from django.http import Http404, JsonResponse
from .services import RecipeManager, validateForm, validateRecipeForm
from django.core.exceptions import ObjectDoesNotExist

recipe_manager = RecipeManager()

def dashboard(request):
    return render(request, 'admin/dashboard.html')

def explore(request):
    return render(request, 'admin/view-recipe.html')

def add(request):
    return render(request, 'admin/add-recipe.html')

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
    try:
        return validateRecipeForm(request, form, recipe_manager.updateRecipeData, recipe_id)
    except ObjectDoesNotExist:
        return JsonResponse({"success": False, "error": "Recipe not found"}, status=404)

def delete_recipe(request):
    if request.method != 'POST':
        return JsonResponse({"success": False, "error": "Invalid request method"}, status=400)
    
    body = json.loads(request.body)
    id = int(body.get('id'))
    
    recipe_manager.deleteRecipeData(id)
    return JsonResponse({
            "success": True
    })

def get_recipe_by_id(request):
    recipe_id = request.GET.get('RecipeID')
    try:
        recipe_data = recipe_manager.getRecipeData(recipe_id, request)
        return JsonResponse({
            "success": True,
            "recipe": recipe_data
        })
    except ObjectDoesNotExist:
        return JsonResponse({
            "success": False,
            "error": f"Recipe with ID {recipe_id} not found."
        }, status=404)
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": "An internal error occurred."
        }, status=500)

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