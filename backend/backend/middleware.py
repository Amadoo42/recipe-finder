from django.urls import resolve
from django.shortcuts import redirect
from django.http import JsonResponse
from core.constants import LOGIN_URL, USER_DASHBOARD_URL


class RecipeFinderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            match = resolve(request.path)
            app_name = match.app_name
        except:
            app_name = None

        # Allow all requests into the core
        if app_name == 'core':
            return self.get_response(request)
        
        user = request.user

        # If user not logged in, redirect to login page
        if not user.is_authenticated:
            if request.path.startswith('/api/'):
                return JsonResponse({
                    'success': False, 
                    'description': 'User not authenticated.'
                }, status=401)
            return redirect(LOGIN_URL)
        
        role = user.role

        if role == 'user' and app_name == 'admin_app':
            return redirect(USER_DASHBOARD_URL)

        return self.get_response(request)