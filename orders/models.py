from django.db import models
from django.db.models import Sum, F, DecimalField
from users.models import User, Address
from products.models import Product

# Create your models here.

ORDER_STATUS_CHOICES = (
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled")
    )

class Order(models.Model):
    """
    Represents a customer order.

    Attributes:
        user: The customer who placed the order.
        total_price: Final total price of the order.
        status: Order status (pending, paid, shipped, delivered).
    """
    placed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default="pending")
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    total_amount = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.placed_by} - {self.id}"
    
    # @property
    # def total_amount(self):
    #     return self.items.aggregate(
    #         total=Sum(F("price_at_purchase") * F("quantity"), output_field=DecimalField())
    #     )["total"] or 0

    def recalculate_total(self):
        total = self.items.aggregate(
            total=Sum(F("price_at_purchase") * F("quantity"), output_field=DecimalField())
        )["total"] or 0
        self.total_amount = total
        self.save(update_fields=["total_amount"])


class OrderItem(models.Model):
    """
    Represents a single product inside an order.

    Attributes:
        order: The related order.
        product: The product purchased.
        quantity: Number of units purchased.
        price: Price per unit at the time of purchase.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=9, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['order', 'product'],
                                    name='unique_product_per_order')
        ]

    def __str__(self):
        return f"{self.id} - {self.product} - {self.quantity}"

