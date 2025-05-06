import logging
from .models import Product, Category, ProductImage, Supplier  # Ensure Supplier is imported
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .serializers import ProductSerializer, CategorySerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsOwnerOrReadOnly

logger = logging.getLogger(__name__)

class ProductView(APIView):
    def get(self, request):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info(f"Query parameters: {request.query_params}")
        category = request.query_params.get('category', None)
        logger.info(f"Fetching products. Category filter: {category}")
        if category and category != 'All':
            products = Product.objects.filter(category__name=category)
        else:
            products = Product.objects.all()
        logger.info(f"Number of products fetched: {products.count()}")
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    def get(self, request, pk):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info(f"Fetching product details for ID: {pk}")
        try:
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            logger.error(f"Product with ID {pk} not found.")
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


# product/views.py
class ProductCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Changed from IsAdminUser
    authentication_classes = [JWTAuthentication]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        logger.info(f"User making request: {request.user}")
        data = request.data.copy()

        try:
            category = Category.objects.get(id=data.get("category"))
            supplier = Supplier.objects.get(name=request.user.username)

            product_data = {
                "name": data.get("name"),
                "description": data.get("description"),
                "price": data.get("price"),
                "stock": data.get("stock", False),
                "category": category.id,
                "supplier": supplier.id,
            }

            # Handle single image (backward compatibility)
            if 'image' in request.FILES:
                product_data['image'] = request.FILES['image']

            serializer = ProductSerializer(data=product_data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProductEditView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]  # Added IsOwnerOrReadOnly
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            data = request.data.copy()
            
            updated_data = {
                "name": data.get("name", product.name),
                "description": data.get("description", product.description),
                "price": data.get("price", product.price),
                "stock": data.get("stock", product.stock),
            }
            
            if 'category' in data:
                updated_data['category'] = Category.objects.get(id=data['category']).id
            
            # Handle single image (backward compatibility)
            if 'image' in request.FILES:
                updated_data['image'] = request.FILES['image']
            
            serializer = ProductSerializer(
                product, 
                data=updated_data, 
                partial=True,
                context={'request': request}
            )
            
            if serializer.is_valid():
                product = serializer.save()
                
                # Handle multiple images
                if request.FILES.getlist('images'):
                    for image_data in request.FILES.getlist('images'):
                        ProductImage.objects.create(
                            product=product,
                            image=image_data
                        )
                
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductDeleteView(APIView):
    authentication_classes = [JWTAuthentication]  # Add this
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]  # Added IsOwnerOrReadOnly

    def delete(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response(
                {"detail": "Product successfully deleted."}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class CategoryListView(APIView):
    def get(self, request):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info("Fetching all categories.")
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        logger.info(f"Number of categories fetched: {categories.count()}")
        return Response(serializer.data, status=status.HTTP_200_OK)