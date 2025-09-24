from django.urls import path, include
from .views import CartItemViewset, CartViewset
from rest_framework_nested import routers

router = routers.DefaultRouter()

router.register(r'carts', CartViewset, basename='cart')

cart_items_router = routers.NestedDefaultRouter(router, r'carts', lookup='cart')
cart_items_router.register(r'items', CartItemViewset, basename='cart-items')

urlpatterns = router.urls + cart_items_router.urls