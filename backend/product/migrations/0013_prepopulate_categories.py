# Generated by Django 4.2.20 on 2025-03-30 08:28

from django.db import migrations

def create_initial_categories(apps, schema_editor):
    Category = apps.get_model('product', 'Category')
    categories = [
        'Clothing',
        'Shoes',
        'Electronics',
        'Food',
        'Household Appliances',
        'Medical'
    ]
    for name in categories:
        Category.objects.get_or_create(
            name=name,
            slug=name.lower().replace(' ', '-')
        )


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0012_product_category'),
    ]

    operations = [
    ]
