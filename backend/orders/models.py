from django.db import models
from account.models import User

class OrderRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    product_details = models.TextField(blank=True)  # Add blank=True
    whatsapp_message = models.TextField(blank=True)  # Add this field if needed
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    product_details = models.TextField()
    status = models.CharField(max_length=20, default='pending')
    ordered_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"