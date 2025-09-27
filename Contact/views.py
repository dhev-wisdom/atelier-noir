from django.core.mail import EmailMessage, send_mail
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer
from django.conf import settings
from rest_framework.decorators import permission_classes


@permission_classes([permissions.IsAuthenticated])
class ContactView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def perform_create(self, serializer):
        contact = serializer.save()
        send_mail(
            subject=f"New Contact Message: {contact.subject or 'No Subject'}",
            message=f"From: {contact.name} <{contact.email}>\n\n{contact.message}",
            from_email=contact.email,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False
        )
        # email = EmailMessage(
        #     subject=f"New Contact Message: {contact.subject or 'No Subject'}",
        #     body=f"From: {contact.name} <{contact.email}>\n\n{contact.message}",
        #     from_email=contact.email,
        #     to=[settings.EMAIL_HOST_USER],
        # )
        # email.send(fail_silently=True)