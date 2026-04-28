from django.contrib import admin
from django.urls import include, path
from admins import views

app_name='admins'
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('explore/', views.explore, name='explore'),
    path('add/', views.add_recipe, name='add'),
]