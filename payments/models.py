from django.db import models
from orders.models import Order
from users.models import User
from uuid import uuid4

PAYMENT_METHODS = (
    ("card", "Card"),
    ("bankTransfer", "BankTransfer"),
)

PAYMENT_STATUS = (
    ("pending", "Pending"),
    ("successful", "Successful"),
    ("failed", "Failed"),
    ("cancelled", "Cancelled"),
    ("refunded", "Refunded")
)

CURRENCIES = (
    ("ngn", "NGN"),
    ("usd", "USD"),
    ("eur", "EUR"),
    ("gbp", "GBP"),
    ("aud", "AUD"),
    ("cad", "CAD"),
)

# Create your models here.
class Payment(models.Model):
    """Payment model"""
    payer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    payer_email = models.EmailField(max_length=50, null=True, blank=True)
    payer_phone = models.CharField(max_length=20, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    status = models.CharField(max_length=15, choices=PAYMENT_STATUS, default="pending")
    payment_method = models.CharField(max_length=15, choices=PAYMENT_METHODS, default="card")
    transaction_id = models.CharField(max_length=100, null=True, blank=True, unique=True)
    booking_reference = models.UUIDField(default=uuid4, unique=True, editable=False)
    currency = models.CharField(max_length=10, choices=CURRENCIES, default="usd")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.order} - {self.amount} - {self.status}"
