from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import SavedItemSerializer, WishListSerializer
from .models import SavedItem, Wishlist

# Create your views here.
class WishListViewset(viewsets.ModelViewSet):
    """Manage wishlists"""
    queryset = Wishlist.objects.all()
    serializer_class = WishListSerializer
    permission_classes = [permissions.IsAuthenticated]


class SavedItemViewset(viewsets.ModelViewSet):
    """Manage items inside a wishlist"""
    queryset = SavedItem.objects.all()
    serializer_class = SavedItemSerializer
    permission_classes = [permissions.IsAuthenticated]

