from django.db import models
from products.models import Product
from users.models import User

# Create your models here.

class Cart(models.Model):
    """Cart Model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CartItem(models.Model):
    """Cart items model"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.IntegerField(default=1)
    price_at_addition = models.DecimalField(max_digits=9, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'],
                                    name='unique_product_per_cart')
        ]

    def __str__(self):
        return f"{self.id} - {self.product.name} - Cart({self.cart})"
