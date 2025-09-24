from rest_framework import permissions, viewsets
from .serializers import OrderSerializer, OrderItemSerializer
from .models import Order, OrderItem

# Create your views here.
class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class OrderItemsViewset(BaseViewSet):
    """
    view for OrderItem class
    """
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class OrderViewSet(BaseViewSet):
    """
    view for Order class
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.all()

    def perform_create(self, serializer):
        total = sum(item.product.discounted_price * item.quantity
                    for item in self.request.data.get('items', []))
        serializer.save(placed_by=self.request.user, total_amount=total)
