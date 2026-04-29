from django.urls import path
from user_app import views

app_name = 'user_app'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('search/', views.search, name='search'),
    path('favourites/', views.favourites, name='favourites'),
    path('recipe-details/', views.recipe_details, name='recipe_details'),
]