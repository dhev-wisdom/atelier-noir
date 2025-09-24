import requests
from django.conf import settings
from django.urls import reverse
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Payment
from orders.models import Order
from .serializers import PaymentSerializer
from django_ratelimit.decorators import ratelimit


@ratelimit(key="user_or_ip", rate="5/m", block=True)
@api_view(["POST"])
@permission_classes([AllowAny])
def initiate_payment(request):
    """
    Start a payment with Chapa and return a checkout URL.
    Body: { "order": <id>, "amount": <amount> }
    """
    order_id = request.data.get("order")
    
    order = get_object_or_404(Order, id=order_id)
    if order.status == "paid":
        return Response({"error": f"This order with id {order.id} has already been paid for"}, status=400)
    if order.status == "cancelled":
        return Response({"error": f"This order with id {order.id} has been cancelled and can no longer be paid for"}, status=400)
    if order.status == ["shipped", "delivered"]:
        return Response({"error": f"This order has already been {order.status}"}, status=400)
    
    amount = order.total_amount

    try:
        email_from_data = request.data.get('email')
        if email_from_data and email_from_data != "":
            email = email_from_data
        else:
            email = request.user.email
    except:
        email = request.user.email

    try:
        phone_number = request.data.get('phone_number')
    except:
        phone_number = request.user.phone_number

    try:
        first_name = request.user.first_name
    except:
        first_name = "Guest"

    try:
        last_name = request.user.first_name
    except:
        last_name = ""

    payment, created = Payment.objects.get_or_create(
        order=order,
        defaults={"amount": amount,
                  "payer": request.user if request.user.is_authenticated else None,
                  "payer_email": email, "payer_phone": phone_number
                  }
    )

    if not created:
        payment.payer=request.user if request.user.is_authenticated else None
        payment.payer_email=email
        payment.payer_phone=phone_number
        payment.save()

    headers = {
        "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "amount": str(amount),
        "currency": "USD",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "tx_ref": str(payment.booking_reference),
        "callback_url": request.build_absolute_uri(reverse("verify-payment")),
        "customization": {
            "title": "Order Payment",
            "description": f"Payment for order {order.id}"
        }
    }

    response = requests.post(f"{settings.CHAPA_BASE_URL}/initialize",
                              json=data, headers=headers)
    res_data = response.json()

    print("res_data: ", res_data)

    if res_data.get("status") == "success":
        payment.transaction_id = data["tx_ref"]
        payment.save()
        return Response({
            "checkout_url": res_data["data"]["checkout_url"],
            "payment": PaymentSerializer(payment).data
        })
    return Response(res_data, status=400)


@api_view(["GET"])
@permission_classes([AllowAny])
def verify_payment(request):
    """
    Verify a payment with Chapa using tx_ref.
    Query param: ?trx_ref=<tx_ref>
    """
    trx_ref = request.query_params.get("trx_ref")
    if not trx_ref:
        return Response({"error": "trx_ref required"}, status=400)
    
    print("Road block 2")

    headers = {"Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}"}
    response = requests.get(f"{settings.CHAPA_BASE_URL}/verify/{trx_ref}",
                            headers=headers)
    res_data = response.json()

    try:
        payment = Payment.objects.get(transaction_id=trx_ref)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)

    if res_data.get("status") == "success" and res_data["data"]["status"] == "success":
        with transaction.atomic():
            payment.status = "successful"
            payment.save()

            if hasattr(payment, "order") and payment.order:
                payment.order.status = "paid"
                payment.order.save()
            
        return Response({"message": "Payment verified successfully"})
    else:
        payment.status = "failed"
        payment.save()
        return Response({"message": "Payment failed"}, status=400)
    