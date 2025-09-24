from rest_framework.serializers import ModelSerializer
from .models import Wishlist, SavedItem

class SavedItemSerializer(ModelSerializer):
    """Serialize individual item in wishlist"""
    class Meta:
        model = SavedItem
        fields = "__all__"


class WishListSerializer(ModelSerializer):
    """Serialize a wishlist with it's saved item"""
    items = SavedItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "user", "items", "created_at", "updated_at"]