# ads/models.py
from django.db import models
from account.models import User
from datetime import datetime

class AdCampaign(models.Model):
    AD_TYPES = (
        ('image', 'Image'),
        ('video', 'Video'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    ad_title = models.CharField(max_length=200)
    ad_description = models.TextField()
    ad_type = models.CharField(max_length=10, choices=AD_TYPES)
    ad_file = models.FileField(upload_to='ads/')
    payment_proof = models.ImageField(upload_to='payment_proofs/')
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    duration_days = models.IntegerField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.ad_title

    def is_displayable(self):
        today = datetime.now().date()
        return self.is_approved and self.is_active and self.start_date <= today <= self.end_date
