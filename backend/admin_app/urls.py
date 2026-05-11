from django.urls import include, path
from admin_app import views

app_name = 'admin_app'

urlpatterns = [
    path('', views.dashboard, name='admin_dashboard'),
    path('explore/', views.explore, name='explore'),
    path('add/', views.add_recipe, name='add'),
]