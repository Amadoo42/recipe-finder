from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser

class Recipe(models.Model):
    COURSE_CHOICES = [
        ('Appetizers', 'Appetizers'),
        ('Main', 'Main'),
        ('Dessert', 'Dessert'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    course_type = models.CharField(max_length=20, choices=COURSE_CHOICES)

    image_file = models.ImageField(upload_to='recipe/images/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    def clean(self):
        super().clean()
        if not self.image_file and not self.image_url:
            raise ValidationError("You must provide either an image file or an image URL.")
        if self.image_file and self.image_url:
            raise ValidationError("Please provide an image file OR an image URL, not both.")

    @property
    def get_image(self):
        if self.image_file:
            return self.image_file.url
        return self.image_url

    def __str__(self):
        return self.name
    
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    saved_recipes = models.ManyToManyField(Recipe, blank=True, related_name='favorited_by')

    def __str__(self):
        return self.username
    
class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    name = models.CharField(max_length=255)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.name}"