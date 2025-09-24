"""
URL configuration for atelier_noir_clothing project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
import products.urls
import orders.urls
import users.urls

schema_view = get_schema_view(
    openapi.Info(
        title="Atelier Noir API",
        default_version="v1",
        description="API documentation for Atelier Noir API",
        contact=openapi.Contact(email="nonsowisdom62@gmail.com")
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("", lambda request: HttpResponse("Atelier Noir is running 🚀")),
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name="scheme-swagger-ui"),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name="schema-redoc"),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/', include("products.urls")),
    path('api/', include("orders.urls")),
    path('api/', include("users.urls")),
    path('api/', include("favourites.urls")),
    path('api/', include("cart.urls")),
    path('api/payments/', include("payments.urls")),
]
