# Django
import os
import threading
import time
from io import BytesIO

from django.conf import settings
# External libraries
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.core.mail import EmailMessage
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Avg
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import UpdateView
from django.utils import timezone

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate
# Rest framework
from rest_framework import generics, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAdminUser
from rest_framework.parsers import MultiPartParser



# Local modules
from .forms import (
    CustomUserCreationForm,
    ProductForm,
    CommentForm,
    OrderForm,
    OrderItemForm,
)


from .models import CustomUser, Product, Comment, Order, OrderItem, Category
from .permissions import IsProductOrSaleManager, IsProductOwnerOrSaleManager, IsSalesManager, IsProductOwner
from .serializers import CommentSerializer, CommentSerializerWithUser, CustomUserSerializer, ProductSerializer, OrderSerializer, \
    ProductSerializerWithAllReview, CategorySerializer, UserSerializer,CategoryNameSerializer,ProductSerializerToCreate, CreateProductSerializerDenemeBilmemKac,OrderManagerSerializer  ,OrderManagerSerializer


  


class ProductPriceManager(APIView):
    permission_classes = [IsAuthenticated, IsProductOrSaleManager, IsProductOwnerOrSaleManager]

    def post(self, request):
            print(request.data)
            product = Product.objects.get(id=request.data['id'])
            product.initial_price = request.data['price']
            product.save()
            # Check object permissions
            return Response({"detail": "Price updated successful"})


def send_discount_alert_email(user,product):
    # Create the email message
    email_subject = 'Products on your wishlist are on sale!'
    email_body = 'The following products on your wishlist are currently on discount:\n\n'
    email_body += '\n'+product.product_name + ' - ' + product.description + ' - ' + str(product.price) + ' - ' + str(product.discount)
    email_body += '\n\nCheck them out now!'

    email = EmailMessage(
        email_subject,
        email_body,
        settings.EMAIL_HOST_USER,
        [user.email],
        reply_to=[settings.DEFAULT_FROM_EMAIL],
    )

    # Send the email
    email.send()
class ProductDiscountManager(APIView):
    permission_classes = [IsAuthenticated, IsProductOrSaleManager, IsProductOwnerOrSaleManager]
    def get(self, request):
        products = Product.objects.get(id=request.GET.get('id'))
        serializer = ProductSerializerWithAllReview(products)
        return Response(serializer.data)
    def post(self, request):

        if 'id' in request.data.keys() and 'discount' in request.data.keys():
            product = Product.objects.get(id=request.data['id'])
            product.discount = request.data['discount']
            product.save()
            for i in product.wishlist.all():
                threading.Thread(target=send_discount_alert_email, args=(i,product)).start()
            return Response({"detail": "Discount updated successful"})
        else:
            return Response({"error":"Something happened"}, status=400)

class ProductManager(APIView):
    permission_classes = [IsAuthenticated, IsProductOrSaleManager, IsProductOwnerOrSaleManager]
    def get(self, request):
        products = Product.objects.filter(Q(product_manager=request.user) | Q(sale_manager=request.user))
        serializer = ProductSerializerWithAllReview(products, many=True)
        return Response(serializer.data)


class OrderListAPIView(APIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        print(serializer.data)
        return Response(serializer.data)


# Create, update, delete user api endpoints
# TODO turn it to api view
class CustomUserEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class CustomUserListAPIView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = ()


def products_sorted_by_rating():
    products = Product.objects.annotate(
        average_rating=Avg('comment__rating', filter=Q(comment__isApproved=True))
    ).order_by('-average_rating')

    return products


class ProductListView(APIView):
    authentication_classes = []
    permission_classes = []
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination

    def get(self, request, format=None):
        category = request.GET.get('category', None)
        querry = request.GET.get('querry', None)
        products = products_sorted_by_rating()

        if category is not None:
            products = products.filter(category_id=int(category))

        if querry is not None:
            products = products.filter(
                Q(name__icontains=querry) | Q(description__icontains=querry)
            )
        paginator = Paginator(products, 90)  # Show 10 products per page
        page = request.GET.get('page')
        products = paginator.get_page(page)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetTopProducts(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        products = Product.objects.all().annotate(
            rating_avg=Avg('comment__rating', filter=Q(comment__isApproved=True))).order_by('-rating_avg')[:5]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Product detail api endpoint
class ProductDetailAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        obj = get_object_or_404(Product, pk=int(request.GET.get('id')))
        doesExist = False
        if request.user:
            if obj.wishlist.filter(id=request.user.id).exists():
                doesExist = True
        serialized = ProductSerializer(obj)
        return Response({'product': serialized.data, 'doesExist': doesExist}, status=status.HTTP_200_OK)


class DeleteProduct(APIView):
    permission_classes = [IsAuthenticated,IsProductOwner]

    def post(self, request, format=None):
        product = Product.objects.get(id=request.data.get("id"))
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ApproveComment(APIView):
    permission_classes = [IsAuthenticated, IsProductOwner]

    def post(self, request, format=None):
        comment = Comment.objects.get(id=request.data.get("id"))
        comment.isApproved = not comment.isApproved
        comment.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
class DeleteComment(APIView):
    permission_classes = [IsAuthenticated, IsProductOwner]

    def post(self, request, format=None):
        Comment.objects.get(id=request.data.get("id")).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def ProductCreateApiView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        form = ProductForm()
        if request.method == 'POST':
            form = ProductForm(request.POST)
            if form.is_valid():
                form.save()
                return Response({'detail': 'Product created successfully'}, status=status.HTTP_201_CREATED)
        return Response({'detail': form.errors}, status=status.HTTP_400_BAD_REQUEST)


@login_required
def product_update(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('product', pk=product_id)
    else:
        form = ProductForm(instance=product)
    return render(request, 'product_update.html', {'form': form, 'product': product})


# @login_required
# def product_update(request, product_id):
#     product = get_object_or_404(Product, pk=product_id)
#     if request.method == 'POST':
#         form = ProductForm(request.POST, request.FILES, instance=product)
#         if form.is_valid():
#             form.save()
#             return redirect('product', pk=product_id)
#     else:
#         form = ProductForm(instance=product)
#     return render(request, 'product_update.html', {'form': form, 'product': product})
#
#
# def product_delete(request, product_id):
#     product = get_object_or_404(Product, pk=product_id)
#     if request.method == 'POST':
#         product.delete()
#         return redirect('products')
#     return render(request, 'product_delete.html', {'product': product})


def readComments(request):
    comments = Comment.objects.all()
    # total_comments = comments.count()     Just noted for now, we gonna use this function in the future in order to shouw number of reviews in the future
    context = {'comments': comments}
    return render(request, 'dashboard_comment.html', context)


class CreateCommentView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        form = CommentForm()
        data = request.data

        if request.method == 'POST':
            form = CommentForm(request.data)
            if form.is_valid():
                # alreadyExists = Comment.objects.filter(to_product=data['to_product'], from_user=request.user).exists()
                # if alreadyExists:
                #     return Response({'details': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
                #
                # # 2- No Rating or 0
                # elif data['rating'] == 0:
                #     return Response({'details': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

                comment = Comment.objects.create(from_user=request.user, **form.cleaned_data)
                comment.save()
                return Response({'detail': 'Comment created successfully'}, status=status.HTTP_201_CREATED)
        return Response({'detail': form.errors}, status=status.HTTP_400_BAD_REQUEST)


class CreateProductReview(APIView):
    def post(self, request, pk):
        user = request.user
        data = request.POST  # data, rating ve comment sadece
        product = get_object_or_404(Product, pk=pk)
        alreadyExists = Comment.objects.filter(product=product, user=user).exists()
        print(data)
        # if exist return true
        # if not exist return false

        # 1- Review already exists
        if alreadyExists:
            return Response({'details': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)


        # 2- No Rating or 0
        elif data['rating'] == 0:
            return Response({'details': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

        # 3- Create review
        else:
            comment = Comment.objects.create(
                user=user,  # burda bi sıkıntı çıkabilir ilerde
                product=product,
                name=user.first_name,  # name = user.first_name,
                rating=data['rating'],
                comment=data['comment']
            )

            # comments = Comment.objects.get(product = pk) # o producta atılan tum commentler
            comments = Comment.objects.filter(product=pk)
            # comments = product.comment_set.all()
            # comments = Comment.objects.filter(product=)
            product.save()

            return Response("Review Added")



def order_success(request, pk):
    order = Order.objects.get(pk=pk)

    context = {
        'order': order,
        'success_msg': 'You have successfully ordered this product !!'
    }

    return render(request, 'order_success.html', context)


class UserOrdersView(APIView):
    def get(self, request, format=None):
        # Retrieve the orders for the authenticated user
        user_orders = request.user.orders.all()

        # Serialize the orders
        serializer = OrderSerializer(user_orders, many=True)

        # Return the response in the desired format
        return Response({"orders": serializer.data}, status=status.HTTP_200_OK)


def send_order_pdf_email(order, user):
    # Generate PDF file from HTML template

    buffer = BytesIO()

    # Create a PDF file
    pdf = SimpleDocTemplate(buffer, pagesize=letter)
    # Create table data for the JSON data
    table_data = [
        ["Order ID", order.id],
        ["Order Date", order.createdAt.strftime("%d-%m-%Y %H:%M:%S")],
        ["Order Status", order.status],
        ["Customer Name", user.first_name],
        ["Customer Email", user.email],
        ["Payment Method", order.paymentMethod],
        ["Card Number", order.card_no],
    ]
    order_items = order.orderitem_set.all()
    # Loop through order items, query the product data and add them to the table data
    for idx, order_item in enumerate(order_items):
        product = Product.objects.get(id=order_item.product.id)
        table_data.extend(
            [
                [f"Order Item {idx + 1} - Name", product.product_name],
                [f"Order Item {idx + 1} - Brand", product.brand],
                [f"Order Item {idx + 1} - Warranty", product.warranty],
                [f"Order Item {idx + 1} - Price", f"${product.price:.2f}"],
                [f"Order Item {idx + 1} - Quantity", order_item.qty],
            ]
        )

    # Create a table with the table data
    table = Table(table_data)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 14),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]
        )
    )
    pdf.build([table])
    pdf_filename = f"order_{int(time.time())}_{user.username}.pdf"
    pdf_file_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', pdf_filename)
    with open(pdf_file_path, 'wb') as pdf_file:
        buffer.seek(0)
        pdf_file.write(buffer.getvalue())
    # Define the recipient's email address
    # Create an email message with the PDF attached
    email = EmailMessage(
        'New order created',
        'Please see the attached PDF for details of the new order.',
        settings.EMAIL_HOST_USER,
        [user.email],
        reply_to=[settings.DEFAULT_FROM_EMAIL],
    )
    buffer.seek(0)
    # Attach the PDF to the email
    email.attach(f"order_{int(time.time())}_{user.username}.pdf", buffer.getvalue(), 'application/pdf')

    # Send the email
    email.send()



class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, format=None):

        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():

            # Check if ordered quantity <= product stock for all items
            order_items_data = request.data.get('orderitems', [])
            for order_item_data in order_items_data:
                product = Product.objects.get(pk=order_item_data['product'])
                qty = order_item_data['qty']
                if qty > product.count_in_stock:

                    return Response({'error': f'Insufficient stock for {product.product_name}'},
                                    status=status.HTTP_400_BAD_REQUEST)

            # Save the Order instance (without the 'orderitems')
            order_data = {k: v for k, v in serializer.validated_data.items()}
            order = Order.objects.create(user=request.user, **order_data)

            # Save related OrderItems and update product stock
            for order_item_data in order_items_data:
                product = Product.objects.get(pk=order_item_data['product'])
                order_item = OrderItem(order=order, product=product, qty=order_item_data['qty'],price=product.price)
                order_item.save()

                # Update product stock
                product.count_in_stock -= order_item_data['qty']
                product.save()

            # Serialize the created order and return the response
            created_order_serializer = OrderSerializer(order)
            threading.Thread(target=send_order_pdf_email, args=(order, request.user,)).start()
            return Response(created_order_serializer.data, status=status.HTTP_201_CREATED)

        else:

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request, format=None):
        order_id = request.data.get('id')

        order = Order.objects.get(id=order_id)
        order.status = 'Cancelled'
        order.save()
        return Response({'success': f'Order {order_id} cancelled'}, status=status.HTTP_200_OK)
class UpdateOrder(UpdateView):
    model = Order
    form_class = OrderForm
    template_name = 'create_order.html'

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        if self.request.POST:
            data['order_items'] = [
                OrderItemForm(self.request.POST, prefix=str(i), instance=self.object.order_items.all()[i]) for i in
                range(len(self.object.order_items.all()))]
        else:
            data['order_items'] = [OrderItemForm(prefix=str(i), instance=self.object.order_items.all()[i]) for i in
                                   range(len(self.object.order_items.all()))]
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        order_items = context['order_items']
        with transaction.atomic():
            self.object = form.save()
            if order_items:
                for order_item in order_items:
                    if order_item.is_valid():
                        order_item = order_item.save(commit=False)
                        order_item.order = self.object
                        order_item.name = order_item.product.name
                        order_item.price = order_item.product.price
                        order_item.save()
                self.object.totalPrice = sum([item.price * item.qty for item in self.object.order_items.all()])
                self.object.save()
        return super().form_valid(form)




class GetProductsByCategory(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            products = category.products.all()

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        



class GetProductsByCategory(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            products = category.products.all()

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

class CreateCategory(APIView):
    permission_classes = (IsAuthenticated,IsProductOwner)

    def post(self, request):
        if "name" in request.data:
            name = request.data['name']
            if Category.objects.filter(name=name).exists():
                return Response({'error': 'Category already exists'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid data, name is required'}, status=status.HTTP_400_BAD_REQUEST)

class CreateRefundRequestView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, format=None):
        order_id = request.data.get('id')
        print(order_id)
        order = get_object_or_404(Order, id=order_id)
        if order.user != request.user:
            return Response({"detail": "You are not authorized to view this order"}, status=status.HTTP_401_UNAUTHORIZED)
        order.status = 'refund-requested'
        order.save()
        return Response({'success': 'Refund request created'}, status=status.HTTP_201_CREATED)



def send_refund_approval_email(user,totalPrice):
    email = EmailMessage(
        'Refund Request Approved',
        'Your refund request has been approved. The amount will be refunded to your account shortly. Total price is:' + str(totalPrice),
        settings.EMAIL_HOST_USER,
        [user.email],
        reply_to=[settings.DEFAULT_FROM_EMAIL],
    )


    # Send the email
    email.send()
    print("Email sent", user.email)


class ApproveRefundRequestView(APIView):
    permission_classes = [IsSalesManager, ]
    def get(self,request):
        refund_requested_orders = Order.objects.filter(status='refund-requested')
        serializer = OrderSerializer(refund_requested_orders, many=True)
        return Response(serializer.data)
    def post(self, request, format=None):
        refund_request_id = request.data.get('id')
        stat = request.data.get('msg')
        print(refund_request_id)
        refund_request = get_object_or_404(Order, id=refund_request_id)
        if refund_request.status != "refund-requested":
            return Response({"detail":"This is not a refund requested order"}) # sonra bakilacak bu condition girmemesi gerekiyor(kutay)
        # Approve the refund request
        if stat == "approve":
            refund_request.status = 'refund-granted'
            print("a")
            for i in OrderItem.objects.filter(order=refund_request):
                print(i.product)
                i.product.count_in_stock += i.qty
                i.product.save()
        else:
            refund_request.status = 'refund-rejected'
        refund_request.save()
        send_refund_approval_email(refund_request.user,refund_request.total_price)

        # Add the refund logic here (e.g., update user balance, etc.)

        return Response({'success': 'Refund request approved'}, status=status.HTTP_200_OK)


# views.py

class CategoryList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategoryNameSerializer(categories, many=True)
        return Response(serializer.data)






class UserWishlistProducts(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        products = Product.objects.filter(wishlist=user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class AddWishlistProducts(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        prod = Product.objects.get(id=request.data.get("prod"))
        if user in prod.wishlist.all():
            prod.wishlist.remove(user)
            prod.save()
            return Response({"detail": "Removed"})

        else:
            prod.wishlist.add(user)
        prod.save()
        return Response({"detail":"Added"})

# USER RELATED VIEWS
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'headers': request.headers, })

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # You can return additional information about the user if needed
            return Response({"detail": "Login successful"})
        else:
            return Response({"detail": "Invalid credentials"}, status=401)
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        form = CustomUserCreationForm(request.data)
        if form.is_valid():
            user = form.save()
            if user:
                return Response({"detail": "Registration successful"})
        return Response({"detail": "Registration failed", "errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)
class LoadUserView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, format=None):
        user = request.user
        user = CustomUserSerializer(user)
        return Response(
            {'user': user.data},
            status=status.HTTP_200_OK
        )
class UserView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class CreateProduct(APIView):
    permission_classes = [AllowAny,]
    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = CreateProductSerializerDenemeBilmemKac(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            product = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserOrderView(APIView):
    permission_classes = [IsAuthenticated,IsProductOwnerOrSaleManager]
    def get(self, request):
        queryset = Order.objects.all()
        serializer = OrderManagerSerializer(queryset, many=True)
        print(serializer.data)
        return Response(serializer.data)


class ManagerOrderList(APIView):
    def get(self, request, format=None):
        orders = Order.objects.all()
        serializer = OrderManagerSerializer(orders, many=True)
        return Response(serializer.data)



class UpdateOrderStatus(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Get the order id and the new status from the request data
            order_id = request.data.get('orderId')
            new_status = request.data.get('status')

            # Get the order
            order = Order.objects.get(id=order_id)

            # Update the status
            order.status = new_status
            order.save()

            # Return a success response
            return Response({'message': 'Order status updated successfully'}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class ProductStockManager(APIView):
    permission_classes = (IsAuthenticated, IsProductOwner)
    def post(self, request):
        product = Product.objects.get(id=request.data.get("id"))
        product.count_in_stock = request.data.get("stock")
        product.save()
        return Response({"detail":"Stock updated"})


class CommentListView(APIView):

    def get(self, request, format=None):
        comments = Comment.objects.all()
        serializer = CommentSerializerWithUser(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
