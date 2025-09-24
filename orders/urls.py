from django.urls import path, include
from rest_framework import routers
from .views import OrderViewSet, OrderItemsViewset

router = routers.DefaultRouter()

router.register(r"orders", OrderViewSet, basename="order")
router.register(r"orderitems", OrderItemsViewset, basename="orderitem")

urlpatterns = [
    path('', include(router.urls)),
]