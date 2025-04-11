from rest_framework import serializers
from .models import Product, Category, Supplier


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# product/serializers.py
from rest_framework import serializers
from .models import Product, Category, Supplier, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']
        read_only_fields = ['id']

class ProductSerializer(serializers.ModelSerializer):
    supplier_info = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)  # Add this line
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'images', 'supplier_info', 'stock', 'category', 'category_name', 'supplier']
        extra_kwargs = {
            'name': {'required': True},
            'price': {'required': True},
            'category': {'required': True},
        }
    
    def get_supplier_info(self, obj):
        if obj.supplier:
            return {
                'name': obj.supplier.name,
                'whatsapp_link': obj.supplier.whatsapp_link
            }
        return None
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            supplier, created = Supplier.objects.get_or_create(
                name=request.user.username,
                defaults={"whatsapp_number": "N/A"}
            )
            validated_data['supplier'] = supplier
        
        # Create product first
        product = super().create(validated_data)
        
        # Handle single image (backward compatibility)
        if 'image' in validated_data:
            ProductImage.objects.create(
                product=product,
                image=validated_data['image'],
                is_primary=True
            )
        
        # Handle multiple images
        if request and request.FILES.getlist('images'):
            for i, image_data in enumerate(request.FILES.getlist('images')):
                ProductImage.objects.create(
                    product=product,
                    image=image_data,
                    is_primary=(i == 0 and 'image' not in validated_data)
                )
        
        return product