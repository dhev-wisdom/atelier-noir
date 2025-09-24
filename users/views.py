from django.shortcuts import render
from rest_framework import permissions, generics, viewsets
from .models import Address
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, AddressSerializer

# Create your views here.
User = get_user_model()

class RegisterViewSet(generics.CreateAPIView):
    """view to Register users"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    """view to list Users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # IsAdminUser


class AddressViewSet(viewsets.ModelViewSet):
    """view to list and modify user addresses"""
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.AllowAny] # IsAuthenticated