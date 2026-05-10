from django.urls import include, path

from core import views

app_name='core'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),

    path('login_API/', views.loginAPI, name='loginAPI'),
    path('signup_API/', views.signupAPI, name='signupAPI'),
    path('logout_API/', views.logoutAPI, name='logoutAPI'),
]
