from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "subject", "message", "created_at", "is_resolved")
