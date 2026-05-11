from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from core.constants import LOGIN_URL, USER_DASHBOARD_URL, ADMIN_DASHBOARD_URL, INDEX_URL
from core.services.Message import Message
from core.models import User, Recipe
from core.services.validation import validation
import json

def index(request):
    return render(request, 'core/index.html')

def login_page(request):
    return render(request, 'core/login.html')

def signup_page(request):
    return render(request, 'core/signup.html')

def loginAPI(request):

    # Must use POST
    if request.method != 'POST':
        return JsonResponse(Message(
            success=False, 
            description='[Login API] Bad Request method not POST'
            ).to_dict(), 
            status=400)

    # Extract request data
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse(Message(
            success=False,
            description='[Login API] Invalid JSON',
        ).to_dict(), status=400)
    
    try:
        username=data.get('username', '').strip()
        password=data.get('password', '').strip()
    except Exception as e:
        return JsonResponse(Message(
            success=False,
            description=f'[Login API] Could not fetch data: {str(e)}',
        ).to_dict(), status=400)

    # Verify credentials
    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse(Message(
            success=False, 
            description='[Login API] Invalid Credentials - Unauthorized'
            ).to_dict(),
            status=401)

    # User successfully authenticated
    login(request, user)

    if user.role == 'user':
        return JsonResponse(Message(
            success=True,
            description='[Login API] Successfully authenticated - redirecting to User Dashboard',
            data=USER_DASHBOARD_URL,
        ).to_dict())
    
    elif user.role == 'admin':
        return JsonResponse(Message(
            success=True,
            description='[Login API] Successfully authenticated - redirecting to Admin Dashboard',
            data=ADMIN_DASHBOARD_URL
        ).to_dict())
    
    else:
        return JsonResponse(Message(
            success= False, 
            description='[Login API] Unknown Role'
            ).to_dict(), 
            status=500)


def createNewUser(data):
    role = data.get('role')
    firstname = data.get('firstName')
    lastname = data.get('lastName')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
        
    new_user = {
        'username': username,
        'password': password,
        'email': email,
        'first_name': firstname,
        'last_name': lastname,
        'role': role
    }
    return new_user


def signupAPI(request):
    # Must use POST
    if request.method != 'POST':
        return JsonResponse(Message(
            success=False, 
            description='[SignUp API] Bad Request method not POST'
            ).to_dict(),
            status=400)
    
    # Extract request data
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse(Message(
            success=False,
            description='[SignUp API] Invalid JSON',
        ).to_dict(), status=400)
    
    try:
        new_user = createNewUser(data)
    except Exception as e:
        return JsonResponse(Message(
            success=False,
            description=f'[SignUp API] Could not fetch data: {str(e)}'
        ).to_dict(), status=400)

    try:
        validationResult = validation(new_user)
    except Exception as e:
        return JsonResponse(Message(
            success=False,
            description=f'[SignUp API] Validation has failed: {str(e)}'
        ).to_dict(), status=400)

    if validationResult.success == False:
        return JsonResponse(validationResult.to_dict(), status=400)

    # Username uniqueness
    if User.objects.filter(username=data.get('username')).exists():
        return JsonResponse(Message(
            success=False,
            description='Username already taken'
        ).to_dict(), status=400)

    # Email uniqueness
    if User.objects.filter(email=data.get('email')).exists():
        return JsonResponse(Message(
            success=False,
            description='Email already in use'
        ).to_dict(), status=400)

    # Create the user
    try:
        new_user = User.objects.create_user(**new_user)
    except Exception as e:
        return JsonResponse(Message(
            success=False,
            description=f'[SignUp API] Could not create user: {str(e)}'
        ).to_dict(), status=400)
    
    # User successfully authenticated
    login(request, new_user)

    return JsonResponse(Message(
        success=True, 
        description='[SignUp API] Successfully created',
        data=LOGIN_URL
        ).to_dict())


def logoutAPI(request):
    """
    Logs out the user and clears the session.
    """
    if request.method != 'POST':
        return JsonResponse(Message(
            success=False,
            description='[Logout API] Bad Request method not POST'
        ).to_dict(), status=400)
    
    if not request.user.is_authenticated:
        return JsonResponse(Message(
            success=False,
            description='[Logout API] Not logged in'
        ).to_dict(), status=401)

    logout(request)
    return JsonResponse(Message(
        success=True, 
        description="[LogoutAPI] Logged out successfully",
        data=INDEX_URL).to_dict()
        )

def recipe_detail(request, recipe_id):
    try:
        recipe = Recipe.objects.prefetch_related('recipe_ingredients__ingredient').get(pk=recipe_id)
    except:
        return JsonResponse({'success': False, 'description': 'Recipe Not Found'}, status=404)
    
    recipe_data = {
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description,
        'courseType': recipe.course_type,
        'image': recipe.get_image,
        'ingredients': [
            {
                'name': ri.ingredient.name,
                'quantity': ri.quantity,
                'unit': ri.unit,
            }
            for ri in recipe.recipe_ingredients.all()
        ]
    }
    return JsonResponse({'success': True, 'data': recipe_data})