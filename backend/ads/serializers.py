from rest_framework import serializers
from .models import AdCampaign

class AdCampaignSerializer(serializers.ModelSerializer):
    ad_file_url = serializers.SerializerMethodField()
    payment_proof_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AdCampaign
        fields = [
            'id', 'user', 'name', 'email', 'phone_number', 
            'ad_title', 'ad_description', 'ad_type', 'ad_file', 'ad_file_url',
            'payment_proof', 'payment_proof_url', 'payment_method',
            'is_approved', 'is_active', 'start_date', 'end_date',
            'duration_days', 'created_at'
        ]
        read_only_fields = [
            'is_approved', 'is_active', 'start_date', 'end_date', 
            'created_at', 'ad_file_url', 'payment_proof_url'  # Removed 'user' from here
        ]

    def create(self, validated_data):
        # Ensure the user is set from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def get_ad_file_url(self, obj):
        if obj.ad_file:
            return obj.ad_file.url
        return None
    
    def get_payment_proof_url(self, obj):
        if obj.payment_proof:
            return obj.payment_proof.url
        return None
    
    def validate_email(self, value):
        return value