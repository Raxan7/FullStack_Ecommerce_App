# Generated by Django 4.2.20 on 2025-04-08 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ads', '0002_delete_orderrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='adcampaign',
            name='payment_method',
            field=models.CharField(choices=[('lipa_namba', 'Lipa Namba'), ('other', 'Other')], default='lipa_namba', max_length=20),
        ),
    ]
