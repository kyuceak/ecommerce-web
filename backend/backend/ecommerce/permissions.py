from rest_framework import permissions
from .models import CustomUser

class IsProductOrSaleManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == CustomUser.PRODUCT_MANAGER or request.user.role == CustomUser.SALE_MANAGER)
        )

class IsProductOwnerOrSaleManager(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(obj.product_manager == request.user or obj.sale_manager == request.user)

class IsProductOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == CustomUser.PRODUCT_MANAGER
        )

    def has_object_permission(self, request, view, obj):
        return bool(obj.product_manager == request.user)

class IsSalesManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == CustomUser.SALE_MANAGER
        )

    def has_object_permission(self, request, view, obj):
        return bool(obj.sale_manager == request.user)
