from django.urls import path
from admin_app import views

app_name = 'admin_app'
urlpatterns = [
    path('', views.dashboard, name='admin_dashboard'),
    path('explore/', views.explore, name='explore'),
    path('add/', views.add, name='add'),
    path('add_recipe/', views.add_recipe, name='add_recipe'),
    path('add_ingredient/', views.add_ingredient, name='add_ingredient'),
    path('add_other_unit/', views.add_other_unit, name='add_other_unit'),
    path('get_recipe_by_id/', views.get_recipe_by_id, name='get_recipe_by_id'),
    path('update_recipe/', views.update_recipe, name='update_recipe'),
    path('get_all_recipes/', views.get_all_recipes, name='get_all_recipes'),
    path('delete_recipe/', views.delete_recipe, name='delete_recipe'),
    path('get_all_ingredients/', views.get_all_ingredients, name='get_all_ingredients'),
]