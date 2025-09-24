from .views import initiate_payment, verify_payment
from django.urls import path, include

urlpatterns = [
    path("initiate/", initiate_payment, name="initiate-payment"),
    path("verify/", verify_payment, name="verify-payment")
]