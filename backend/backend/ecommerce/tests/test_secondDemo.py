from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from .models import Product
from .views import ProductPriceManager, ProductDiscountManager, ProductManager
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product, Order, Comment, OrderItem
from .serializers import ProductSerializer, OrderSerializer, CommentSerializer, OrderItemSerializer, CategorySerializer
import json

class ProductPriceManagerTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='test', password='test')
        self.product = Product.objects.create(product_name='TestProduct', initial_price=100.0)
        self.view = ProductPriceManager.as_view()

    def test_post(self):
        request = self.factory.post('/product_price_manager/', {'id': self.product.id, 'price': 200.0})
        request.user = self.user
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.initial_price, 200.0)

class ProductDiscountManagerTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='test', password='test')
        self.product = Product.objects.create(product_name='TestProduct', discount=0.0)
        self.view = ProductDiscountManager.as_view()

    def test_post(self):
        request = self.factory.post('/product_discount_manager/', {'id': self.product.id, 'discount': 20.0})
        request.user = self.user
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.discount, 20.0)

class ProductManagerTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='test', password='test')
        self.product = Product.objects.create(product_name='TestProduct', product_manager=self.user)
        self.view = ProductManager.as_view()

    def test_get(self):
        request = self.factory.get('/product_manager/')
        request.user = self.user
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.product.id)

class GetTopProductsTest(TestCase):
    def test_get(self):
        response = self.client.get('/get_top_products/')
        self.assertEqual(response.status_code, 200)

class ProductDetailAPIViewTest(TestCase):
    def test_get(self):
        product = Product.objects.create(product_name='TestProduct')
        response = self.client.get(f'/product_detail/?id={product.id}')
        self.assertEqual(response.status_code, 200)

class DeleteProductTest(TestCase):
    def test_post(self):
        product = Product.objects.create(product_name='TestProduct')
        user = User.objects.create_user(username='test', password='test')
        self.client.force_login(user)
        response = self.client.post('/delete_product/', {'id': product.id})
        self.assertEqual(response.status_code, 204)

class ApproveCommentTest(TestCase):
    def test_post(self):
        user = User.objects.create_user(username='test', password='test')
        comment = Comment.objects.create(content="test content", user=user)
        self.client.force_login(user)
        response = self.client.post('/approve_comment/', {'id': comment.id})
        self.assertEqual(response.status_code, 204)

class DeleteCommentTest(TestCase):
    def test_post(self):
        user = User.objects.create_user(username='test', password='test')
        comment = Comment.objects.create(content="test content", user=user)
        self.client.force_login(user)
        response = self.client.post('/delete_comment/', {'id': comment.id})
        self.assertEqual(response.status_code, 204)

class ProductCreateApiViewTest(TestCase):
    def test_post(self):
        user = User.objects.create_user(username='test', password='test')
        self.client.force_login(user)
        response = self.client.post('/create_product/', {'product_name': 'New Product'})
        self.assertEqual(response.status_code, 201)

class CreateCommentViewTest(TestCase):
    def test_post(self):
        user = User.objects.create_user(username='test', password='test')
        product = Product.objects.create(product_name='TestProduct')
        self.client.force_login(user)
        response = self.client.post('/create_comment/', {'content': 'Test comment', 'to_product': product.id})
        self.assertEqual(response.status_code, 201)

class GetProductsByCategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category_id = 1
        self.url = reverse('get_products_by_category', kwargs={'category_id': self.category_id})

        # Initialize test data
        self.category = Category.objects.create(name='Electronics')
        self.product_1 = Product.objects.create(name='Phone', category=self.category, price=200)
        self.product_2 = Product.objects.create(name='Laptop', category=self.category, price=1500)

    def test_get_products_by_category(self):
        response = self.client.get(self.url)
        products = Product.objects.filter(category=self.category_id)
        serializer = ProductSerializer(products, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

class UserOrdersViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='test', password='test123')
        self.client.force_authenticate(self.user)
        self.url = reverse('user_orders')

        # Initialize test data
        self.order_1 = Order.objects.create(user=self.user, totalPrice=200)
        self.order_2 = Order.objects.create(user=self.user, totalPrice=1500)

    def test_get_user_orders(self):
        response = self.client.get(self.url)
        orders = Order.objects.filter(user=self.user)
        serializer = OrderSerializer(orders, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"orders": serializer.data})
class CategoryTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.category = Category.objects.create(name='Electronics')

    def test_get_products_by_category(self):
        response = self.client.get(f'/api/category/{self.category.id}/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_category(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/create_category/', data={'name': 'Books'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post('/api/create_category/', data={'name': 'Books'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # because category already exists


class OrderTestCase(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.order = Order.objects.create(user=self.user, status='completed')
        
    def test_create_refund_request(self):
        self.client.login(username='testuser', password='12345')
        
        response = self.client.post('/api/create_refund_request/', data={'id': self.order.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'refund-requested')


class WishlistTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.product = Product.objects.create(name='test_product', price=100)

    def test_add_wishlist_products(self):
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/add_wishlist_product/', data={'prod': self.product.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Added')
        self.assertTrue(self.user in self.product.wishlist.all())

        response = self.client.post('/api/add_wishlist_product/', data={'prod': self.product.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Removed')
        self.assertFalse(self.user in self.product.wishlist.all())


class UserTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@gmail.com',
            'password1': 'secretpassword123',
            'password2': 'secretpassword123',
        }

    def test_register_api(self):
        response = self.client.post('/api/register/', data=self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_login_api(self):
        User.objects.create_user(**self.user_data)

        response = self.client.post('/api/login/', data={
            'username': 'testuser',
            'password': 'secretpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ProductTestCase(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            product_name='test_product', 
            initial_price=100, 
            discount=20,
            count_in_stock=5,
            brand='Test Brand',
            description='Test Description',
            warranty=1,
            category=self.category
        )

    def test_product_discounted_price(self):
        self.assertEqual(self.product.price, 80)  # (initial_price)100 - (100*20/100)

    def test_product_default_rating(self):
        self.assertEqual(self.product.rating, 0)

    def test_product_default_numReviews(self):
        self.assertEqual(self.product.numReviews, 0)


class OrderItemTestCase(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            product_name='test_product', 
            initial_price=100, 
            discount=20,
            count_in_stock=5,
            brand='Test Brand',
            description='Test Description',
            warranty=1,
            category=self.category
        )
        self.user = CustomUser.objects.create_user(username='testuser', password='12345')
        self.order = Order.objects.create(user=self.user, paymentMethod='Card', card_no='1234567890', card_cvk='123')
        self.order_item = OrderItem.objects.create(product=self.product, qty=1, order=self.order, price=self.product.price)

    def test_order_item_creation(self):
        self.assertEqual(self.order_item.product.product_name, 'test_product')
        self.assertEqual(self.order_item.qty, 1)
        self.assertEqual(self.order_item.price, 80)  # discounted price from product
