import random
import string
from datetime import datetime

def generate_order_number(order):
    """
    Generate a beautiful, readable order number like big ecommerce sites
    Format: ORD-YYYY-XXXXXXX (e.g., ORD-2024-A7B9C2D)
    """
    year = datetime.now().year
    # Generate 7 random alphanumeric characters (excluding confusing ones like 0, O, I, 1)
    chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    random_part = ''.join(random.choices(chars, k=7))
    return f"ORD-{order.id}-{year}-{random_part}"

def create_html_email_template(payment):
    """
    Create a beautiful HTML email template for order confirmation
    """
    # Format the date to be more readable
    formatted_date = payment.updated_at.strftime("%B %d, %Y at %I:%M %p")
    
    html_template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }}
            .email-container {{
                background-color: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .success-icon {{
                background-color: #28a745;
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                margin-bottom: 20px;
            }}
            .title {{
                color: #28a745;
                font-size: 28px;
                font-weight: bold;
                margin: 0;
            }}
            .subtitle {{
                color: #6c757d;
                font-size: 16px;
                margin: 10px 0 0 0;
            }}
            .order-details {{
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }}
            .detail-row {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #dee2e6;
            }}
            .detail-row:last-child {{
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }}
            .detail-label {{
                font-weight: 600;
                color: #495057;
            }}
            .detail-value {{
                font-weight: bold;
                color: #212529;
            }}
            .amount {{
                color: #28a745;
                font-size: 20px;
                font-weight: bold;
            }}
            .order-number {{
                color: #007bff;
                font-family: 'Courier New', monospace;
                font-weight: bold;
            }}
            .delivery-info {{
                background-color: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }}
            .delivery-title {{
                font-weight: bold;
                color: #1976d2;
                margin-bottom: 8px;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
                color: #6c757d;
                font-size: 14px;
            }}
            .company-name {{
                font-weight: bold;
                color: #007bff;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="success-icon">✓</div>
                <h1 class="title">Payment Confirmed!</h1>
                <p class="subtitle">Thank you for your purchase. Your order has been successfully processed.</p>
            </div>

            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Order Number:</span>
                    <span class="detail-value order-number">{payment.transaction_id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount Paid:</span>
                    <span class="detail-value amount">${payment.amount}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer Name:</span>
                    <span class="detail-value">{payment.payer.username.title()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Date:</span>
                    <span class="detail-value">{formatted_date}</span>
                </div>
            </div>

            <div class="delivery-info">
                <div class="delivery-title">🚚 Delivery Information</div>
                <p>Your order is being prepared and will be delivered within <strong>2-3 business days</strong>. 
                You'll receive a tracking number once your order ships.</p>
            </div>

            <div class="footer">
                <p>Thank you for choosing <span class="company-name">Your Store Name</span>!</p>
                <p>If you have any questions, feel free to contact our support team.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_template

def create_plain_text_email(payment):
    """
    Create a well-formatted plain text version (fallback)
    """
    formatted_date = payment.updated_at.strftime("%B %d, %Y at %I:%M %p")
    
    plain_text = f"""
    🎉 PAYMENT CONFIRMED! 🎉
    
    Dear {payment.payer.username.title()},
    
    Thank you for your purchase! This email confirms that we have successfully 
    received your payment and your order is now being processed.
    
    ══════════════════════
    ORDER DETAILS
    ══════════════════════
    
    Order Number:    {payment.transaction_id}
    Amount Paid:     ${payment.amount}
    Customer Name:   {payment.payer.username.title()}
    Payment Date:    {formatted_date}
    
    ══════════════════════
    DELIVERY INFORMATION
    ══════════════════════

    Address:         {payment.order.shipping_address}
    
    🚚 Your order will be delivered within 2-3 business days.
    📧 You'll receive tracking information once your order ships.
    
    Thank you for choosing our store!
    
    Best regards,
    The Atelier Noir Team
    
    ---
    Questions? Contact our support team anytime by replying to this mail.
    """
    
    return plain_text