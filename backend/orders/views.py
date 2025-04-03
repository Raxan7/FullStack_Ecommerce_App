from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import OrderRequest
from .serializers import OrderRequestSerializer

class CreateOrderRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        
        # Validate required fields
        required_fields = ['name', 'region', 'district', 'ward', 'street', 'product', 'quantity']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return Response(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get the product
            from product.models import Product
            product = Product.objects.get(id=data['product'])
            
            # Add product details to the order
            data['product_details'] = (
                f"Order for {data['quantity']} {product.name}(s)\n"
                f"Product ID: {product.id}\n"
                f"Unit Price: {product.price}"
            )
            
            serializer = OrderRequestSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_400_BAD_REQUEST
            )

class OrderRequestListView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        orders = OrderRequest.objects.all().order_by('-created_at')
        serializer = OrderRequestSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)