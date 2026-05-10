import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from functools import wraps
from core.models import Recipe
from django.db.models import Q 

def login_check(view_func):
    @wraps(view_func)
    def wrapper(request,*args,**kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'success':False,'description':'Authentication required. Please log in.'}, status=401)
        return view_func(request,*args,**kwargs)
    return wrapper

def index(request):
    return render(request, 'core/index.html')


def signup(request):
    return render(request, 'core/signup.html')

def login(request):

    if request.method =='POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success':False,'description':'Invalid Request'}, status=400)
    
        username=data.get('username','').strip()
        password=data.get('password','').strip()

        user=authenticate(request,username=username,password=password)

        if user is not None:
            login(request,user)
            return JsonResponse({'success':True,'descrition':'Logged in Successfuly','data':{'role':user.role}}) 
        else:
            return JsonResponse({'success': False, 'description': 'The credentials you have provided are invalid!'},status=401)

    return render(request, 'core/login.html')

def recipe_detail(request,recipe_id):
    try:
        recipe = Recipe.objects.prefetch_related('recipe_ingredients__ingredient').get(pk=recipe_id)
    except:
        return JsonResponse({'success': False, 'description': 'Recipe Not Found'},status=404)
    
    recipe_data = {
        'id':recipe.id,
        'name':recipe.name,
        'description':recipe.description,
        'courseType':recipe.course_type,
        'image':recipe.get_image,
        'ingredients':[
            {
                'name': ri.ingredient.name,
                'quantity': ri.quantity,
                'unit': ri.unit,
            }
            for ri in recipe.recipe_ingredients.all()
        ]
    }
    return JsonResponse({'success':True,'data':recipe_data})

def search_recipes(request):
    if request.method != 'GET':
        return JsonResponse({'success': False, 'description': 'Method not allowed'}, status=405)
    
    query = request.GET.get('search', '').strip()
    category = request.GET.get('category', 'all').strip()

    recipes = Recipe.objects.prefetch_related('recipe_ingredients__ingredient')

    if category and category.lower() != 'all':
        recipes = recipes.filter(course_type=category)

    if query:
        recipes = recipes.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(ingredients__name__icontains=query)
        ).distinct()

    results = []
    for recipe in recipes:
        
        ingredients_list = []
        for ri in recipe.recipe_ingredients.all():
            ingredients_list.append({
                'name': ri.ingredient.name,
                'quantity': ri.quantity,
                'unit': ri.unit,
            })

        results.append({
            'id': recipe.id,
            'name': recipe.name,
            'description': recipe.description,
            'courseType': recipe.course_type,
            'image': recipe.get_image,
            'ingredients': ingredients_list,
        })

    return JsonResponse({'success': True, 'data': results})

