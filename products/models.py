from django.db import models

# Create your models here.

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
