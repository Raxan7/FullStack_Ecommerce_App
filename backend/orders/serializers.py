from rest_framework import serializers
from .models import OrderRequest
from product.models import Product

class OrderRequestSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # Add this
    
    class Meta:
        model = OrderRequest
        fields = [
            'id', 'user', 'product', 'quantity', 'name', 'region', 
            'district', 'ward', 'street', 'product_details', 
            'status', 'ordered_at'
        ]
        read_only_fields = ('user', 'product_details', 'status', 'ordered_at')