from django.contrib import admin

from .models import Product, CustomUser, Order, OrderItem, Comment, Category


# Register your models here.
admin.site.register(Product)
admin.site.register(CustomUser)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Comment)
admin.site.register(Category)
