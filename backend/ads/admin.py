from django.contrib import admin
from .models import AdCampaign

@admin.register(AdCampaign)
class AdCampaignAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'name', 'email', 'phone_number', 
        'ad_title', 'ad_description', 'ad_type', 
        'payment_method', 'is_approved', 'is_active',
        'start_date', 'end_date', 'duration_days',
        'created_at'
    )
    list_filter = ('is_approved', 'is_active')
    search_fields = ('name', 'email', 'phone_number')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    def has_add_permission(self, request):
        return False
