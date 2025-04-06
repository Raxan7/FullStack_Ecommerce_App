from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    supplier_info = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'supplier_info', 'stock', 'category', 'category_name', 'supplier']
        extra_kwargs = {
            'name': {'required': True},
            'price': {'required': True},
            'category': {'required': True},
        }
    
    def get_supplier_info(self, obj):
        if (obj.supplier):
            return {
                'name': obj.supplier.name,
                'whatsapp_link': obj.supplier.whatsapp_link
            }
        return None