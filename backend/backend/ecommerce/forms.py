from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser, Product, Order, OrderItem, Comment
from django.forms import ModelForm


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2','nameSurname','address','taxID')





class CustomUserChangeForm(UserChangeForm):
    address = forms.JSONField(required=False)
    cart = forms.JSONField(required=False)
    order = forms.JSONField(required=False)
    role = forms.JSONField(required=False)

    class Meta(UserChangeForm.Meta):
        model = CustomUser
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'address', 'cart', 'order', 'role')


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ('product_name', 'image', 'brand', 'category', 'description', 'initial_price', 'count_in_stock')


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('to_product', 'comment', 'rating')


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ('paymentMethod', 'card_no', 'card_cvk')


class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ('product', 'qty',)
