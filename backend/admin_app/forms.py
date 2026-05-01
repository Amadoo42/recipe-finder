from django import forms
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import requests

REGEX_PATTENRS = {
    'ALPHA_ONLY': r'^[A-Za-z\s]+$',
    'DESCRIPTION_PATTERN': r"^[A-Za-z0-9\s,\/.\-']+$",
}


class RecipeForm(forms.Form):
    name = forms.CharField(max_length=100, required=True,
                           validators=[RegexValidator(regex=REGEX_PATTENRS['ALPHA_ONLY'])])
    
    description = forms.CharField(max_length=250, required=True,
                                  validators=[RegexValidator(regex=REGEX_PATTENRS['DESCRIPTION_PATTERN'])])
    
    course_type = forms.CharField(max_length=30, required=True)
    
    image_file = forms.ImageField(required=False)
    
    image_url = forms.URLField(required=False)
    
    def clean_image_url(self):
        url = self.cleaned_data.get('image_url')
        if not url: return
        response = requests.head(url, timeout=5)
        if response.status_code != 200:
            raise ValidationError("The provided image URL is invalid")
        
        content_type = response.headers.get('Content-Type')
        if not content_type.startswith('image'):
            raise ValidationError("The provided image URL is invalid")
        
    
    
class IngredientForm(forms.Form):
    name = forms.CharField(max_length=100, required=True,
                        validators=[RegexValidator(regex=REGEX_PATTENRS['ALPHA_ONLY'])])
    
    quantity = forms.FloatField(min_value=0.00, required=True)
    
    unit = forms.CharField(max_length=30, required=True,
                                    validators=[RegexValidator(regex=REGEX_PATTENRS['ALPHA_ONLY'])])
    

class OtherUnitForm(forms.Form):
    unit = forms.CharField(max_length=255, required=True,
                           validators=[RegexValidator(regex=REGEX_PATTENRS['ALPHA_ONLY'])])