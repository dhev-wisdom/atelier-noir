from django.contrib import admin
from .models import BlogPost, Comment

@admin.register(BlogPost)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "title", "slug", "content", "image", "created_at", "updated_at")

@admin.register(Comment)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "user", "parent", "content", "created_at")
