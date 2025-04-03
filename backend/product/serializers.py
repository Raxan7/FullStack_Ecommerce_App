from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    supplier_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'supplier_info', 'stock', 'category']
    
    def get_supplier_info(self, obj):
        if obj.supplier:
            return {
                'name': obj.supplier.name,
                'whatsapp_link': obj.supplier.whatsapp_link
            }
        return None