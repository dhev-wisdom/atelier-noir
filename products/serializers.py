from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    """
    class converts complex Category object into simple json
    that the frontend can consume
    """
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    """
    class converts complex Product object into simple json
    that the frontend can consume
    """
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "original_price", "discount", "discounted_price", 
                  "manufacturer", "expiry_date", "category"]
        
    def get_discounted_price(self, obj):
        return obj.original_price * (1 - (obj.discount/100))

    