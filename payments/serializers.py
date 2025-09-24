from .models import Payment
from rest_framework import serializers

class PaymentSerializer(serializers.ModelSerializer):
    """Serialize the Payment model"""
    class Meta:
        model = Payment
        fields = ["id", "order", "amount", "transaction_id", "status", "created_at",
                  "updated_at", "payment_method", "currency", "payer", "payer_email", "payer_phone"]
        read_only_fields = ["transaction_id", "booking_reference", "created_at", "updated_at", 
                            "status", "payer"]