from rest_framework import serializers
from .models import Product, Category, ProductImage, Review
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """
    class converts complex Category object into simple json
    that the frontend can consume
    """
    class Meta:
        model = Category
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    """
    serialize the ProductImage model
    """
    class Meta:
        model = ProductImage
        fields = ["id", "is_main", "images", "uploaded_at"]


class ProductSerializer(serializers.ModelSerializer):
    """
    class converts complex Product object into simple json
    that the frontend can consume
    """
    images = ProductImageSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "original_price", "discount", "discounted_price", 
                  "manufacturer", "expiry_date", "category", "images", "main_image"]
        
    def get_discounted_price(self, obj):
        return obj.original_price * (1 - (obj.discount/100))
    
    def get_main_image(self, obj):
        main = obj.product_images.filter(is_main=True).first()
        return main.images.url if main and main.images else None
    

class ReviewSerializer(serializers.ModelSerializer):
    """
    class to convert review to frontend consumable format
    """
    class Meta:
        model = Review
        fields = ["id", "review_title", "comment", "rating", "created_at", "product", "customer"]

    