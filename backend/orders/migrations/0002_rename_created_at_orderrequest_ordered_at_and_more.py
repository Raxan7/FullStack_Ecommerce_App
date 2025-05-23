# Generated by Django 4.2.20 on 2025-04-03 04:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0014_supplier_product_supplier'),
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orderrequest',
            old_name='created_at',
            new_name='ordered_at',
        ),
        migrations.AddField(
            model_name='orderrequest',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='product.product'),
        ),
        migrations.AddField(
            model_name='orderrequest',
            name='quantity',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='orderrequest',
            name='status',
            field=models.CharField(default='pending', max_length=20),
        ),
    ]
