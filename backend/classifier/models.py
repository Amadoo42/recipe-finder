from django.db import models

class ImageModel(models.Model):
    name = models.TextField()
    image = models.ImageField(upload_to='images')
    
    class Meta:
        db_table = 'Images'