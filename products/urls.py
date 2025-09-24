from django.urls import path, include
from .views import ProductViewSet, CategoryViewSet
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'products', ProductViewSet, basename="product")
router.register(r'categories', CategoryViewSet, basename="category")

urlpatterns = [
    path('', include(router.urls)),
]