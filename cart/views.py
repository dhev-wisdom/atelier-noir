from django.shortcuts import render
from .serializer import CartSerializer, CartItemSerializer
from .models import Cart, CartItem
from rest_framework import viewsets, permissions

# Create your views here.
class CartViewset(viewsets.ModelViewSet):
    """Manage cart"""
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]


class CartItemViewset(viewsets.ModelViewSet):
    """Manage items in a cart"""
    serializer_class = CartItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return CartItem.objects.filter(cart_id=self.kwargs['cart_pk'])

    def perform_create(self, serializer):
        product = self.request.data.get("product")
        from products.models import Product
        product_obj = Product.objects.get(pk=product)
        serializer.save(
            cart_id=self.kwargs["cart_pk"],
            price_at_addition=product_obj.discounted_price
        )

