import json
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

    save_recipe = user.save_recipe.prefetch_related('ingredients').all()

    recipe_data = []
    for recipe in save_recipe:
        recipe_data.append({
        'id':recipe.id,
        'name':recipe.name,
        'description':recipe.description,
        'courseType':recipe.course_type,
        'image':recipe.get_image,
        'ingredients':[
            {'name':i.name,'quantity':i.quantity,'unit':i.unit}
            for i in recipe.ingredient.all()
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
    is_save = user.saved_recipes.filter(pk=recipe_id).exist()

    if is_save:
        user.save_recipe.remove(recipe)
        action = 'removed from'
    else:
        user.save_recipe.add(recipe)
        action = 'added to'  
    return JsonResponse({'success':True,'description':f'Recipe {action} favourite.','data':{'isFavourited': not is_save}})         