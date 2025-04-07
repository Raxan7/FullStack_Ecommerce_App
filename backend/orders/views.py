from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import OrderRequest
from product.models import Product
from .serializers import OrderRequestSerializer

class CreateOrderRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        data = request.data.copy()
        # Don't set user ID directly, let the serializer handle it
        data['user'] = request.user.id  # Remove this line
        
        # Validate required fields
        required_fields = ['name', 'region', 'district', 'ward', 'street', 'product', 'quantity']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return Response(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=data['product'])
            
            # Generate product details
            data['product_details'] = (
                f"Product: {product.name}\n"
                f"Quantity: {data['quantity']}\n"
                f"Unit Price: {product.price}\n"
                f"Total: {float(product.price) * int(data['quantity'])}"
            )
            
            serializer = OrderRequestSerializer(data=data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save(user=request.user)  # Set user here
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class OrderRequestListView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        orders = OrderRequest.objects.all().order_by('-created_at')
        serializer = OrderRequestSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)