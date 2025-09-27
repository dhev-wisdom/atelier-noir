def checkout(payload):
    data = {
        "amount": str("amount"),
        "currency": "USD",
        "email": "email",
        "first_name": "first_name",
        "last_name": "last_name",
        "channels": ["card", "bank_transfer", "ussd", "bank", "qr", "mobile_money"],
        "reference": "order_number",
        "callback_url": "request.build_absolute_uri(reverse('verify-payment'))",
        "metadata": {
            "title": "Order Payment",
            "description": f"Payment for order"
        }
    }


