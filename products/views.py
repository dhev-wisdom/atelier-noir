from django.shortcuts import render
from django.db.models import Sum, Count, Avg
from django.utils.timezone import now, timedelta
from .models import Product, Category, ProductImage, Review
from .serializers import ProductSerializer, CategorySerializer, ProductImageSerializer, ReviewSerializer
from rest_framework import permissions, viewsets, views, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from .filters import ProductFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    """
    view for the Product Model
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Product.objects.all().annotate(
        rating=Avg('reviews__rating')
    )
    ordering_fields = ['rating', 'price', 'created_at']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        product = self.get_object()
        related = Product.objects.filter(
            category=product.category
        ).exclude(id=product.id).order_by('?')[:4]
        serializer = ProductSerializer(related, many=True, context={'request': request})
        return Response(serializer.data)
    
    # @method_decorator(cache_page(60 * 60 * 24))
    # def list(self, request, *args, **kwargs):
    #     return super().list(request, *args, **kwargs)

    # @method_decorator(cache_page(60 * 60 * 24))
    # def retrieve(self, request, *args, **kwargs):
    #     return super().retrieve(request, *args, **kwargs)


@permission_classes([permissions.IsAuthenticated])
class BestSellersView(views.APIView):
    def get(self, request):
        products = Product.objects.annotate(
            total_sold=Sum('order_items__quantity')
        ).order_by('-total_sold')[:10]
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    

@permission_classes([permissions.IsAuthenticated])
class NewProductsView(views.APIView):
    def get(self, request):
        products = Product.objects.order_by('-added_on')[:10]
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


@permission_classes([permissions.IsAuthenticated])
class TrendingProductsView(views.APIView):
    def get(self, request):
        last_30_days = now() - timedelta(days=30)
        products = (
            Product.objects.filter(added_on__gte=last_30_days)
            .annotate(
                total_sold=Sum('order_items__quantity'),
                review_count=Count('reviews')
            )
            # Order by sales first, then by review count
            .order_by('-total_sold', '-review_count')[:10]
        )
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    view for the Category Model
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Category.objects.all()


class ProductImageViewSet(viewsets.ModelViewSet):
    """
    view for Product Image model
    To upload an image, POST /api/product-images/
    In the body of the request, provide product (product ID), image (file) and is_main(boolean)
    """
    def get_queryset(self):
        return ProductImage.objects.filter(product_id=self.kwargs['product_pk'])
    
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProductImage.objects.all()


class ReviewViewSet(viewsets.ModelViewSet):
    """
    view for Product Reviews
    To review a product, POST /api/reviews/
    Provide, product, review_title, rating and comment in the request body
    E,g
    `
    {
        "rating": 4,
        "review_title": "Good quality",
        "comment": "I love it!"
        "product": 1
    }
    `
    """

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_pk'])
    
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

