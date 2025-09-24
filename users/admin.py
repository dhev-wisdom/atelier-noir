from django.contrib import admin
from .models import User, Address  # or Profile if you're using Profile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "phone_number", "is_active", "is_staff", "date_joined")
    search_fields = ("username", "email", "phone_number")
    list_filter = ("is_active", "is_staff")



@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "address_line1", "city", "state", "country", "postal_code", "created_at")
    search_fields = ("user__username", "city", "country")
