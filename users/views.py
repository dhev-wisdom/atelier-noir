from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import permissions, generics, viewsets
from .models import Address
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, AddressSerializer
from .utils import create_plain_text_email

# Create your views here.
User = get_user_model()

class RegisterViewSet(generics.CreateAPIView):
    """view to Register users"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        send_mail(
            subject='Welcome to Atelier Noir Fashion Store!',
            message=create_plain_text_email(user),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )


class UserViewSet(viewsets.ModelViewSet):
    """view to list Users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] # IsAdminUser


class AddressViewSet(viewsets.ModelViewSet):
    """view to list and modify user addresses"""
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated] # IsAuthenticated