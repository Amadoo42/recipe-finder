import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from functools import wraps
from core.models import Recipe 

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
        recipe = Recipe.objects.prefetch_related('ingredients').get(pk=recipe_id)
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
                'name': ingredient.name,
                'quantity': ingredient.quantity,
                'unit': ingredient.unit,
            }
            for ingredient in recipe.ingredients.all()
        ]
    }
    return JsonResponse({'success':True,'data':recipe_data})

