from django.shortcuts import render

def dashboard(request):
    return render(request, 'user/dashboard.html')

def search(request):
    return render(request, 'user/search.html')

def favourites(request):
    return render(request, 'user/favourites.html')

def recipe_details(request):
    return render(request, 'user/recipe_details.html')
