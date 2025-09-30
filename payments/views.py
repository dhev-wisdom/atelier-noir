import json
import requests
from django.conf import settings
from django.urls import reverse
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Payment
from orders.models import Order
from .serializers import PaymentSerializer
from django_ratelimit.decorators import ratelimit
from .utils import generate_order_number, create_plain_text_email


@ratelimit(key="user_or_ip", rate="5/m", block=True)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    """
    Start a payment with Chapa and return a checkout URL.
    To initiate a transaction, provide the order id thus in the post request body
    Body: { "order": <id> }
    Optionally, you can also provide:
    1. email (or default to authenticated user email)
    2. gateway (or default to paystack) [paystack or chapa]
    3. phone_number (or default to authenticated user phone_number).
    Same applies to first name and last name
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
    order_number = generate_order_number(order)

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

   
    gateway = request.data.get('gateway')
    if gateway == None: gateway = payment.gateway

    if gateway.lower() == "chapa":
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
            "tx_ref": order_number,
            "callback_url": request.build_absolute_uri(reverse("verify-payment")),
            "customization": {
                "title": "Order Payment",
                "description": f"Payment for order {order.id}"
            }
        }

        response = requests.post(f"{settings.CHAPA_BASE_URL}/initialize",
                              json=data, headers=headers)
        res_data = response.json()

        if res_data.get("status") == "success":
            payment.transaction_id = data["tx_ref"]
            payment.save()
            return Response({
                "checkout_url": res_data["data"]["checkout_url"],
                "payment": PaymentSerializer(payment).data
            })
        return Response(res_data, status=400)

    paystack_headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    paystack_payload = {
        "amount": str(amount * 100),
        "currency": "NGN",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "channels": ["card", "bank_transfer", "ussd", "bank", "qr", "mobile_money"],
        "reference": order_number,
        "callback_url": request.build_absolute_uri(reverse('verify-payment')),
        "metadata": {
            "title": "Order Payment",
            "description": f"Payment for order {order_number}"
        },
        "label": f"Checkout for order {order_number}"
    }

    paystack_response = requests.post(
        f"{settings.PAYSTACK_BASE_URL}/initialize",
        headers=paystack_headers, 
        data=json.dumps(paystack_payload)
    )

    response_data = paystack_response.json()

    if response_data.get('status') == True:
        payment.transaction_id = paystack_payload["reference"]
        payment.save()
        return Response({
            "checkout_url": response_data['data']['authorization_url'],
            "payment": PaymentSerializer(payment).data
        })
    else:
        return False, "Failed to initiate payment, please try again later."


@api_view(["GET"])
@permission_classes([AllowAny])
def verify_payment(request):
    """
    Verify a payment with Chapa using tx_ref.
    Query param: ?trx_ref=<tx_ref>
    """
    trx_ref = request.query_params.get("trx_ref")
    if trx_ref == None: trx_ref = request.query_params.get("reference")
    
    if not trx_ref:
        return Response({"error": "trx_ref required"}, status=400)

    try:
        payment = Payment.objects.get(transaction_id=trx_ref)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)
    
    gateway = payment.gateway

    if gateway == "chapa":
        headers = {"Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}"}
        response = requests.get(f"{settings.CHAPA_BASE_URL}/verify/{trx_ref}",
                                headers=headers)
        res_data = response.json()

    headers = {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"}
    response = requests.get(f"{settings.PAYSTACK_BASE_URL}/verify/{trx_ref}",
                            headers=headers)
    res_data = response.json()


    if (res_data.get("status") == "success" and res_data["data"]["status"] == "success") or res_data.get("status") == True:
        with transaction.atomic():
            payment.status = "successful"
            payment.save()

            try:
                send_mail(
                    subject='Your order has been confirmed and paid for!',
                    message=create_plain_text_email(payment),
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[payment.payer_email],
                )
            
            except:
                return Response({"message": "Kindly login to complete your payment"})
            


            if hasattr(payment, "order"):
                payment.order.status = "paid"
                payment.order.save()
            
        return Response({"message": "Payment verified successfully"})
    else:
        payment.status = "failed"
        payment.save()
        return Response({"message": "Payment failed"}, status=400)
    