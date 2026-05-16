from django import forms
from django.http import JsonResponse
import json

def validateForm(form: forms.Form):
    '''
    Takes a form object, validates its data, and returns the appropriate json response
    used for IngredientForm, OtherunitForm
    '''
    if not form.is_valid():
        return JsonResponse({"success": False, "errors": form.errors.get_json_data()})
    else:
        return JsonResponse({"success": True})
    
def validateRecipeForm(request, form: forms.Form, save_method, *args):
    '''
    Takes a form object, validates its data, and returns the appropriate json response
    write the recieved valid data to the database
    used for RecipeForm
    '''
    if not form.is_valid():
        return JsonResponse({"success": False, "errors": form.errors.get_json_data()})
    else:
        data = form.cleaned_data
        try:
            ingredients = json.loads(request.POST.get('ingredients_list', '[]'))
        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "errors": {"ingredients_list": ["Invalid JSON."]}},
                status=400
            )
        
        try:
            save_method(data, ingredients, *args) 
            return JsonResponse({"success": True, "message": "Recipe saved successfully!"})
        except Exception as e:
            return JsonResponse({"success": False, "errors": {"server": [str(e)]}}, status=500)