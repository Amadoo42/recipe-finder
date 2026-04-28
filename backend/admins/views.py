from django.shortcuts import render

# Create your views here.
def dashboard(request):
    return render(request, 'dashboard.html')

def explore(request):
    return render(request, 'view-recipe.html')

def add_recipe(request):
    return render(request, 'add-recipe.html')