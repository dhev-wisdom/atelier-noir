from django.urls import path, include
from .views import (ProductViewSet, CategoryViewSet, ProductImageViewSet,
ReviewViewSet, BestSellersView, NewProductsView, TrendingProductsView)
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'products', ProductViewSet, basename="product")
router.register(r'product-images', ProductImageViewSet, basename="product-image")
router.register(r'reviews', ReviewViewSet, basename="review")
router.register(r'categories', CategoryViewSet, basename="category")

urlpatterns = [
    path('', include(router.urls)),
    path('products/best-sellers/', BestSellersView.as_view(), name="best-sellers"),
    path('products/new/', NewProductsView.as_view(), name="new-products"),
    path('products/trending/', TrendingProductsView.as_view(), name="trending-products"),
]