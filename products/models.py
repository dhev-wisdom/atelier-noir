from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User

# Create your models here.

def image_upload_path(instance, filename):
    return f"products/{instance.product.id}/{filename}"

class Category(models.Model):
    """
    Represents a product category.
    Example: Electronics, Fashion, Groceries.
    """
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Represents a product available in the store.

    Attributes:
        name: The name of the product.
        description: A short description of the product.
        price: The price of the product (before discount).
        discount_percentage: Optional discount as a percentage.
        stock: Available quantity.
        category: The category this product belongs to.
    """
    name = models.CharField(max_length=100)
    category = models.ManyToManyField(Category, help_text="Category will be returned as a list of category IDs")
    added_on = models.DateTimeField(auto_now_add=True)
    product_description = models.TextField(null=True, blank=True)
    manufacturer = models.CharField(max_length=50)
    warranty = models.IntegerField(null=True, blank=True,
                                   help_text="Number of years of product's warranty. " \
                                   "Leave empty if there is none")
    expiry_date = models.DateField(null=True, blank=True)
    original_price = models.DecimalField(decimal_places=2, max_digits=7)
    discount = models.DecimalField(decimal_places=0, max_digits=5, default=0, help_text="Discount percentage (e.g. 10 = 10%)")
    stock = models.PositiveIntegerField(default=1)

    @property
    def discounted_price(self):
        return self.original_price * (1 - (self.discount / 100))

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """
    Model to facilate adding images to products
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    images = models.ImageField(upload_to=image_upload_path)
    is_main = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name}-image-{self.id} - {('Main' if self.is_main else 'Image')}"
    

class Review(models.Model):
    """
    Model to store customers reviews for products
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_title = models.CharField(max_length=50, null=True, blank=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review for {self.product.name} - {self.id}"
    
