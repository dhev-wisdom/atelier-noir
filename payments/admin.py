from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "amount", "payment_method", "status", "transaction_id", "created_at", "booking_reference")
    search_fields = ("transaction_id", "order__id")
    list_filter = ("status", "payment_method")
