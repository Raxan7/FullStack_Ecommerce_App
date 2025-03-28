from django.urls import path
from .views import CreateOrderRequestView, OrderRequestListView

urlpatterns = [
    path('request/', CreateOrderRequestView.as_view(), name='create-order-request'),
    path('all/', OrderRequestListView.as_view(), name='order-request-list'),
]