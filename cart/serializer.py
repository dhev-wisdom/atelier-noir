from rest_framework.serializers import ModelSerializer
from .models import Cart, CartItem

class CartItemSerializer(ModelSerializer):
    """Serialize indiviual items in Cart"""
    class Meta:
        model = CartItem
        read_only_fields = ["price_at_addition"]
        fields = ["id", "product", "quantity", "price_at_addition"]

        def create(self, validated_data):
            product = validated_data["product"]
            validated_data["price_at_addition"] = product.discounted_price
            return super().create(validated_data)


class CartSerializer(ModelSerializer):
    """Serialize Cart"""
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        read_only_fields = ['user']
        fields = ["id", "items", "user", "created_at", "updated_at"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)