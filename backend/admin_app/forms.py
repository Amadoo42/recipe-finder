from django import forms
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import requests
from django.core.validators import URLValidator
from PIL import Image
from io import BytesIO

REGEX_PATTERNS = {
    'ALPHA_ONLY': r'^[A-Za-z\s]+$',
    'DESCRIPTION_PATTERN': r"^[A-Za-z0-9\s,\/.\-']+$",
}


class RecipeForm(forms.Form):
    COURSE_CHOICES = [
        ('Appetizers', 'Appetizers'),
        ('Main', 'Main'),
        ('Dessert', 'Dessert'),
    ]
    name = forms.CharField(max_length=100, required=True,
                           validators=[RegexValidator(regex=REGEX_PATTERNS['ALPHA_ONLY'])])
    
    description = forms.CharField(max_length=250, required=True,
                                  validators=[RegexValidator(regex=REGEX_PATTERNS['DESCRIPTION_PATTERN'])])
    
    courseType = forms.ChoiceField(choices=COURSE_CHOICES, required=True)
    
    image_file = forms.ImageField(required=False)
    
    image_url = forms.URLField(required=False)
    
    def clean(self):
        cleaned_data = super().clean()
        image_file = cleaned_data.get('image_file')
        image_url = cleaned_data.get('image_url')

        if image_file and image_url:
            raise ValidationError("Provide either an image file or an image URL, not both.")

        return cleaned_data
    
    def clean_image_url(self):
        url = self.cleaned_data.get('image_url')
        if not url:
            return url
        
        validate = URLValidator()
        try:
            validate(url)
        except ValidationError:
            raise ValidationError("Enter a valid URL.")
        
        try:
            # stream=True fetches headers without downloading the body
            with requests.get(url, timeout=3, stream=True) as r:
                r.raise_for_status()
                if not r.headers.get('Content-Type', '').startswith('image/'):
                    raise ValidationError("URL does not point to an image.")
        except:
            raise ValidationError("Image URL is unreachable or invalid.")

        return url
        
    
class IngredientForm(forms.Form):
    name = forms.CharField(max_length=100, required=True,
                        validators=[RegexValidator(regex=REGEX_PATTERNS['ALPHA_ONLY'])])
    
    quantity = forms.FloatField(min_value=0.00, required=True)
    
    unit = forms.CharField(max_length=30, required=True,
                                    validators=[RegexValidator(regex=REGEX_PATTERNS['ALPHA_ONLY'])])
    

class OtherUnitForm(forms.Form):
    unit = forms.CharField(max_length=255, required=True,
                           validators=[RegexValidator(regex=REGEX_PATTERNS['ALPHA_ONLY'])])