from django.db import models
from django.core.exceptions import ValidationError


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

def get_default_category():
    return Category.objects.get_or_create(name='Electronics', slug='electronics')[0].id
    

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    whatsapp_number = models.CharField(max_length=20)
    # other fields...

    @property
    def whatsapp_link(self):
        return f"https://wa.me/{self.whatsapp_number}"
    
    def __str__(self):
        return f"{self.name}"


class Product(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.BooleanField(default=False)
    image = models.ImageField(null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_DEFAULT,
        default=get_default_category
    )
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)

    def clean(self):
        if not self.name or not self.price or not self.category:
            raise ValidationError("Name, price, and category are required fields.")

    def __str__(self):
        return self.name