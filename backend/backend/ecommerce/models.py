import random
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.db.models import Avg, Count,Sum, F
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    PRODUCT_MANAGER = 1
    SALE_MANAGER = 2
    USER = 3
    nameSurname = models.CharField(max_length=200, null=True)
    taxID = models.CharField(max_length=200, null=True)
    ROLE_CHOICES = (
        (PRODUCT_MANAGER, 'Product Manager'),
        (SALE_MANAGER, 'Sale Manager'),
        (USER, 'User'),
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=USER, null=True)
    address = models.CharField(max_length=200, null=True)
    def __str__(self):
        return self.username


class Category(models.Model):
    class Meta:
        app_label = "ecommerce"
        
    name = models.CharField(max_length=200,unique=True,primary_key=True)



class Product(models.Model):
    product_name = models.CharField(max_length=200)
    discount = models.IntegerField(default=0)
    image = models.ImageField()  # imageField kullanmak için pillow yüklü olmalı bu yüzden pip install pillow yaz terminalde
    brand = models.CharField(max_length=200)
    # category = models.CharField(max_length=200)
    description = models.TextField()
    initial_price = models.DecimalField(max_digits=10, decimal_places=2)
    count_in_stock = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    warranty = models.IntegerField(default=0)
    category = models.ForeignKey(
        Category,
        on_delete=models.DO_NOTHING,
        related_name='products'
    )

    wishlist = models.ManyToManyField(CustomUser, related_name='wishlist_products', blank=True)

    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    @property
    def rating(self):
        comments = self.comment_set.all()
        average = comments.aggregate(Avg('rating')).get('rating__avg')
        return average or 0
    @property
    def price(self):
        return self.initial_price - (self.initial_price * self.discount / 100)
    @property
    def numReviews(self):
        comments = self.comment_set.all()
        count = comments.aggregate(Count('id')).get('id__count')
        return count

    def __str__(self):
        return self.product_name


class Comment(models.Model):
    class Meta:
        app_label = "ecommerce"

    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=False)
    to_product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    comment = models.CharField(max_length=255)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_date = models.DateTimeField(default=timezone.now)
    isApproved = models.BooleanField(default=False)

    def __str__(self):
        return self.comment


class Order(models.Model):
    class Meta:
        app_label = "ecommerce"

    PROCESSING = 'processing'
    IN_TRANSIT = 'in-transit'
    DELIVERED = 'delivered'
    CANCELED = 'canceled'
    REFUND_REQUESTED = 'refund-requested'
    REFUND_GRANTED = 'refund-granted'
    REFUND_REJECTED = 'refund-rejected'
    ORDER_STATUS_CHOICES = [
        (PROCESSING, 'Processing'),
        (IN_TRANSIT, 'In-Transit'),
        (DELIVERED, 'Delivered'),
        (CANCELED, 'Canceled'),
        (REFUND_REQUESTED, 'Refund Requested'),
        (REFUND_GRANTED, 'Refund Granted'),
        (REFUND_REJECTED, 'Refund Rejected')
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    paymentMethod = models.CharField(max_length=200)
    card_no = models.CharField(max_length=200)
    card_cvk = models.CharField(max_length=200)
    createdAt = models.DateTimeField(default=timezone.now,editable=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default=PROCESSING)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def _str_(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    class Meta:
        app_label = "ecommerce"

    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    qty = models.IntegerField()
    order = models.ForeignKey('Order', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    def _str_(self):
        return str(self.product.product_name)