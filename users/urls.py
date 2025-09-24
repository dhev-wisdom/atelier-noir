from django.urls import path, include
from .views import RegisterViewSet, UserViewSet, AddressViewSet
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'users', UserViewSet, basename="user")
router.register(r"addresses", AddressViewSet, basename="address")

urlpatterns = [
    path("register/", RegisterViewSet.as_view(), name="register"),
    path("", include(router.urls))
]