from django.db import models
from users.models import User
from products.models import Product

# Create your models here.

class Wishlist(models.Model):
    """Wishlist model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlists")
    name = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.user.email} - {self.name}"
    

class SavedItem(models.Model):
    """Products saved in Wishlist"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name="items")
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wishlist.name} - {self.product.name}"
