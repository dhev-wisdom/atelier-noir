from django.contrib import admin
from .models import Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "placed_by", "total_amount", "status", "created_at", "updated_at", "shipping_address")
    search_fields = ("place_by__username", "id")
    list_filter = ("status", "created_at")

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity", "price_at_purchase")
    search_fields = ("order__id", "product__name")
