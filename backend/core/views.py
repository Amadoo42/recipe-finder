from django.shortcuts import render, redirect
from django.conf import settings

def index(request):
    return render(request, 'core/index.html')

def login(request):
    return render(request, 'core/login.html')

def signup(request):
    return render(request, 'core/signup.html')