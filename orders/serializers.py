from .models import Order, OrderItem
from rest_framework import serializers

class OrderItemSerializer(serializers.ModelSerializer):
    """
    serializer converts complex python OrderItem object
    into simple json that the frontend can consume
    """
    class Meta:
        model = OrderItem
        read_only_fields = ["price_at_purchase"]
        fields = ["id", "order", "product", "quantity", "price_at_purchase"]

    def create(self, validated_data):
        product = validated_data["product"]
        validated_data["price_at_purchase"] = product.discounted_price
        return super().create(validated_data)


class OrderSerializer(serializers.ModelSerializer):
    """
    serializer converts complex python Order object
    into simple json that the frontend can consume
    Serialize orders and include their items.
    Items are read-only; creation handled by backend logic.
    """
    items = OrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=9, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        read_only_fields = ["total_amount", "placed_by"]
        fields = ["id", "items", "total_amount", "shipping_address", "created_at", "updated_at"]

