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
        
        serializer = OrderRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderRequestListView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        orders = OrderRequest.objects.all().order_by('-created_at')
        serializer = OrderRequestSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)