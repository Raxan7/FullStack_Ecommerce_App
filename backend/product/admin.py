from django.contrib import admin
from .models import Product, Category, Supplier


admin.site.register(Product)
admin.site.register(Supplier)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)