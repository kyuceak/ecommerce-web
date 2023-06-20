from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from ..models import CustomUser, Product, Comment, OrderItem, Order

class CustomUserModelTest(TestCase):
    def test_create_custom_user(self):
        user = CustomUser.objects.create(
            username="testuser",
            email="test@example.com",
            password="testpassword",
            address={"city": "Test City", "street": "Test Street"},
            role=["customer"],
        )
        user.refresh_from_db()

        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertIsNotNone(user.password)
        self.assertEqual(user.address, {"city": "Test City", "street": "Test Street"})
        self.assertEqual(user.role, ["customer"])


class ProductModelTest(TestCase):
    def test_create_product(self):
        product = Product.objects.create(
            name="Test Product",
            brand="Test Brand",
            category="Test Category",
            description="Test Description",
            rating=4.5,
            numReviews=10,
            price=Decimal("19.99"),
            countInStock=5,
        )
        product.refresh_from_db()

        self.assertEqual(product.name, "Test Product")
        self.assertEqual(product.brand, "Test Brand")
        self.assertEqual(product.category, "Test Category")
        self.assertEqual(product.description, "Test Description")
        self.assertEqual(product.rating, Decimal("4.5"))
        self.assertEqual(product.numReviews, 10)
        self.assertEqual(product.price, Decimal("19.99"))
        self.assertEqual(product.countInStock, 5)


class CommentModelTest(TestCase):
    def test_create_comment(self):
        user = CustomUser.objects.create(
            username="testuser",
            email="test@example.com",
            password="testpassword",
        )

        product = Product.objects.create(
            name="Test Product",
            brand="Test Brand",
            category="Test Category",
            description="Test Description",
            rating=4.5,
            numReviews=10,
            price=Decimal("19.99"),
            countInStock=5,
        )

        comment = Comment.objects.create(
            from_user=user,
            to_product=product,
            comment="Test Comment",
            rating=5,
            isApproved=True,
        )

        comment.refresh_from_db()

        self.assertEqual(comment.from_user, user)
        self.assertEqual(comment.to_product, product)
        self.assertEqual(comment.comment, "Test Comment")
        self.assertEqual(comment.rating, 5)
        self.assertTrue(comment.isApproved)


class OrderItemModelTest(TestCase):
    def test_create_order_item(self):
        product = Product.objects.create(
            name="Test Product",
            brand="Test Brand",
            category="Test Category",
            description="Test Description",
            rating=4.5,
            numReviews=10,
            price=Decimal("19.99"),
            countInStock=5,
        )

        order_item = OrderItem.objects.create(
            product=product,
            name="Test Product",
            qty=2,
            price=Decimal("19.99"),
            image="test_image.jpg",
        )

        order_item.refresh_from_db()

        self.assertEqual(order_item.product, product)
        self.assertEqual(order_item.name, "Test Product")
        self.assertEqual(order_item.qty, 2)
        self.assertEqual(order_item.price, Decimal("19.99"))
        self.assertEqual(order_item.image, "test_image.jpg")

class OrderModelTest(TestCase):
    def test_create_order(self):
        user = CustomUser.objects.create(
            username="testuser",
            email="test@example.com",
            password="testpassword",
        )

        product = Product.objects.create(
            name="Test Product",
            brand="Test Brand",
            category="Test Category",
            description="Test Description",
            rating=4.5,
            numReviews=10,
            price=Decimal("19.99"),
            countInStock=5,
        )

        order_item = OrderItem.objects.create(
            product=product,
            name="Test Product",
            qty=2,
            price=Decimal("19.99"),
            image="test_image.jpg",
        )

        order = Order.objects.create(
            user=user,
            paymentMethod="Credit Card",
            card_no="1234123412341234",
            card_cvk="123",
            totalPrice=Decimal("39.98"),
            productName=product,
        )

        order.order_items.add(order_item)
        order.refresh_from_db()

        self.assertEqual(order.user, user)
        self.assertEqual(order.paymentMethod, "Credit Card")
        self.assertEqual(order.card_no, "1234123412341234")
        self.assertEqual(order.card_cvk, "123")
        self.assertEqual(order.totalPrice, Decimal("39.98"))
        self.assertEqual(order.productName, product)
        self.assertIn(order_item, order.order_items.all())

