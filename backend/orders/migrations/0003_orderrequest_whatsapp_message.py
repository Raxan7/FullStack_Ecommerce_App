# Generated by Django 4.2.20 on 2025-04-07 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_rename_created_at_orderrequest_ordered_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderrequest',
            name='whatsapp_message',
            field=models.TextField(blank=True),
        ),
    ]
