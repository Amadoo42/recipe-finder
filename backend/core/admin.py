from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Recipe, Ingredient

class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1

class RecipeAdmin(admin.ModelAdmin):
    inlines = [IngredientInline]
    list_display = ('name', 'courseType')
    search_fields = ('name',)

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom App Fields', {'fields': ('role', 'saved_recipes')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Ingredient)