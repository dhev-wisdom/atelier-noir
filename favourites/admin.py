from django.contrib import admin
from .models import Wishlist, SavedItem


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "created_at", "updated_at")
    search_fields = ("user__username", "name")


@admin.register(SavedItem)
class SavedItemAdmin(admin.ModelAdmin):
    list_display = ("id", "wishlist", "product", "added_at")
    search_fields = ("wishlist__name", "product__name")
