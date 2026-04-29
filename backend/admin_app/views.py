from django.shortcuts import render

def dashboard(request):
    return render(request, 'admin/dashboard.html')

def explore(request):
    return render(request, 'admin/view-recipe.html')

def add_recipe(request):
    return render(request, 'admin/add-recipe.html')