from django.urls import path, include
from .views import (ProductViewSet, CategoryViewSet, ProductImageViewSet,
ReviewViewSet, BestSellersView, NewProductsView, TrendingProductsView)
from rest_framework import routers
from rest_framework_nested import routers as nested_routers

router = routers.DefaultRouter()
nested_router = nested_routers.DefaultRouter()

nested_router.register(r'products', ProductViewSet, basename="product")
router.register(r'categories', CategoryViewSet, basename="category")

product_items_router = nested_routers.NestedDefaultRouter(nested_router, r'products', lookup='product')
product_items_router.register(r'images', ProductImageViewSet, basename='product-images')
product_items_router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('products/best-sellers/', BestSellersView.as_view(), name="best-sellers"),
    path('products/new/', NewProductsView.as_view(), name="new-products"),
    path('products/trending/', TrendingProductsView.as_view(), name="trending-products"),
]

urlpatterns += nested_router.urls
urlpatterns += product_items_router.urls