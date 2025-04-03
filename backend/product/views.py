import logging
from .models import Product, Category
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .serializers import ProductSerializer, CategorySerializer

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


class ProductCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info(f"Request body: {request.data}")
        data = request.data
        product = {
            "name": data.get("name"),
            "description": data.get("description"),
            "price": data.get("price"),
            "stock": data.get("stock"),
            "image": data.get("image"),
        }
        serializer = ProductSerializer(data=product)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Product created with ID: {serializer.instance.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Product creation failed: {serializer.errors}")
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProductDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info(f"Deleting product with ID: {pk}")
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            logger.info(f"Product with ID {pk} successfully deleted.")
            return Response({"detail": "Product successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            logger.error(f"Product with ID {pk} not found.")
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class ProductEditView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info(f"Request body: {request.data}")
        logger.info(f"Editing product with ID: {pk}")
        try:
            product = Product.objects.get(id=pk)
            data = request.data
            updated_product = {
                "name": data.get("name", product.name),
                "description": data.get("description", product.description),
                "price": data.get("price", product.price),
                "stock": data.get("stock", product.stock),
                "image": data.get("image", product.image),
            }
            serializer = ProductSerializer(product, data=updated_product, partial=True)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Product with ID {pk} successfully updated.")
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                logger.error(f"Product update failed: {serializer.errors}")
                return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            logger.error(f"Product with ID {pk} not found.")
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class CategoryListView(APIView):
    def get(self, request):
        logger.info(f"Incoming request: {request.method} {request.get_full_path()}")
        logger.info("Fetching all categories.")
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        logger.info(f"Number of categories fetched: {categories.count()}")
        return Response(serializer.data, status=status.HTTP_200_OK)