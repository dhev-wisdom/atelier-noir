def create_plain_text_email(user):
    """
    Create a well-formatted plain text version (fallback)
    """
    formatted_date = user.created_at.strftime("%B %d, %Y at %I:%M %p")
    
    plain_text = f"""
    
    Dear {user.username.title()},
    
    Thank you for registering with us!
    This email confirms that we have successfully 
    created an account with us.
    
    Thank you for choosing our store!

    Shop plenty and we hope to see you around 😇
    
    Best regards,
    The Atelier Noir Team
    
    ---
    Questions? Contact our support team anytime by replying to this mail.
    """
    
    return plain_text