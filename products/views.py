from django.shortcuts import render
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from rest_framework import permissions, viewsets

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    """
    view for the Product Model
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.all()


class CategoryViewSet(viewsets.ModelViewSet):
    """
    view for the Category Model
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all()
