from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from core.models import Recipe
from core.views import login_check

def dashboard(request):
    return render(request, 'user/dashboard.html')

def search(request):
    return render(request, 'user/search.html')

def favourites(request):
    return render(request, 'user/favourites.html')

def recipe_details(request):
    return render(request, 'user/recipe_details.html')

@login_check
def get_favourite(request):
    user = request.user

    save_recipe = user.saved_recipes.prefetch_related('recipe_ingredients__ingredient').all()

    recipe_data = []
    for recipe in save_recipe:
        recipe_data.append({
        'id':recipe.id,
        'name':recipe.name,
        'description':recipe.description,
        'courseType':recipe.course_type,
        'image':recipe.get_image,
        'ingredients':[
            {'name':ri.ingredient.name,'quantity':ri.quantity,'unit':ri.unit}
            for ri in recipe.recipe_ingredients.all()
        ]
    })
    return JsonResponse({'success':True,'data':recipe_data})

@login_check
@require_http_methods(['POST'])

def toggle_favourite(request,recipe_id):

    user = request.user
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except:
        return JsonResponse({'success':False,'description':'Recipe Not Found'},status=404)
    is_save = user.saved_recipes.filter(pk=recipe_id).exists()

    if is_save:
        user.saved_recipes.remove(recipe)
        action = 'removed from'
    else:
        user.saved_recipes.add(recipe)
        action = 'added to'  
    return JsonResponse({'success':True,'description':f'Recipe {action} favourite.','data':{'isFavourited': not is_save}})         