from django.urls import path, include
from .views import SavedItemViewset, WishListViewset
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'wishlists', WishListViewset, basename='wishlist')
router.register(r'saved-items', SavedItemViewset, basename='saved-item')

urlpatterns = [
    path('', include(router.urls))
]