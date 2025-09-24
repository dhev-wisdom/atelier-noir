from rest_framework.serializers import ModelSerializer, CharField
from django.contrib.auth import get_user_model
from .models import User, Address

User = get_user_model()


class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "phone_number", "password", "user_type"]


    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data["email"],
            username=validated_data["username"],
            phone_number=validated_data.get("phone_number"),
            user_type=validated_data.get("user_type", "shopper"),
            password=validated_data["password"]
        )
        return user
    

class UserSerializer(ModelSerializer):
    """
    converts User model to simple json
    that the frontend can consume
    """
    class Meta:
        model = User
        fields = ["id", "email", "username", "phone_number", "user_type"]

    
class AddressSerializer(ModelSerializer):
    """
    converts User model to simple json
    that the frontend can consume
    """
    class Meta:
        model = Address
        fields = "__all__"

