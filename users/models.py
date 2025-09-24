from django.db import models
from uuid import uuid4
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.

USER_TYPE_CHOICES = (
        ("shopper", "Shopper"),
        ("vendor", "Vendor"),
    )

class User(AbstractUser):
    """Extended User Model"""
    email = models.EmailField(unique=True)
    phone_number = PhoneNumberField(blank=True, null=True, unique=True, help_text="Customer's phone number in international format")
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default="shopper")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


class Address(models.Model):
    """Address table for User addresses for Order checkout"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=20)
    country = models.CharField(max_length=20)
    postal_code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.first_name} - {self.address_line1}, {self.city}"

