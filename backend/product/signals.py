from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Supplier

@receiver(post_save, sender=User)
def create_supplier_for_new_user(sender, instance, created, **kwargs):
    if created:  # Check if the user is newly created
        Supplier.objects.get_or_create(name=instance.username, defaults={"whatsapp_number": "N/A"})
