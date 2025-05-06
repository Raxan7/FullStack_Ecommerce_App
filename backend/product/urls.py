from django.urls import path
from product import views
from .views import CheckWhatsAppNumberView, ProductView, ProductDetailView, ProductCreateView, ProductDeleteView, ProductEditView, CategoryListView, UpdateWhatsAppNumberView

urlpatterns = [
    path('products/', views.ProductView.as_view(), name="products-list"),
    path('product/<str:pk>/', views.ProductDetailView.as_view(), name="product-details"),
    path('product-create/', views.ProductCreateView.as_view(), name="product-create"),
    path('product-update/<str:pk>/', views.ProductEditView.as_view(), name="product-update"),
    path('product-delete/<str:pk>/', views.ProductDeleteView.as_view(), name="product-delete"),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('update-whatsapp/', UpdateWhatsAppNumberView.as_view(), name='update-whatsapp'),
    path('check-whatsapp/', CheckWhatsAppNumberView.as_view(), name='check-whatsapp'),
]