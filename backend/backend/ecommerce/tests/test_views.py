from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from ..models import CustomUser, Product,Comment
from ..serializers import CustomUserSerializer, ProductSerializer
from decimal import Decimal


class RegisterAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("user_register")
        self.client = APIClient()

    def test_register_new_user(self):
        user_data = {
            "username": "testuser",
            "email": "tests@example.com",
            "password1": "test_password",
            "password2": "test_password",
        }
        response = self.client.post(self.url, user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Registration successful")

    def test_register_failed(self):
        user_data = {
            "username": "testuser",
            "email": "tests@example.com",
            "password1": "test_password",
            "password2": "wrong_password",
        }
        response = self.client.post(self.url, user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Registration failed")


class LoadUserViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("user_load")
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="tests@example.com",
            password="test_password",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_load_user(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_load_user_failed(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# class CustomUserDetailAPIViewTestCase(APITestCase):
#     def setUp(self):
#         self.user = CustomUser.objects.create_user(
#             username="testuser",
#             email="tests@example.com",
#             password="test_password",
#         )
#         self.url = reverse("customuser-detail", kwargs={"pk": self.user.pk})
#         self.client = APIClient()
#         self.client.force_authenticate(user=self.user)
#
#     def test_delete_user(self):
#         response = self.client.delete(self.url)
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.user.refresh_from_db()
#         self.assertFalse(self.user.is_active)
#

class CustomUserListAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("user_list")
        self.client = APIClient()

    def test_list_users(self):
        response = self.client.get(self.url)
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


class ProductListAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("product_list")
        self.client = APIClient()

    def test_list_products(self):
        response = self.client.get(self.url)
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


class ProductDetailAPIViewTestCase(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            description="Test Product Description",
            price=9.99,
        )
        self.url = reverse("product_detail")
        self.client = APIClient()

    def test_get_product_detail(self):
        response = self.client.get(self.url, {"id": self.product.pk})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ProductSerializer(self.product)
        self.assertEqual(response.data, serializer.data)

    def test_get_product_detail_not_found(self):
        response = self.client.get(self.url, {"id": -1})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)




class CreateProductReviewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword",
        )

        self.product = Product.objects.create(
            user=self.user,
            name="Test Product",
            brand="Test Brand",
            category="Test Category",
            description="Test Description",
            rating=4.5,
            numReviews=10,
            price=Decimal("19.99"),
            countInStock=5,
        )

        self.client.login(username='testuser', password='testpassword')

    def test_create_product_review_already_exists(self):
        Comment.objects.create(
            user=self.user,
            product=self.product,
            rating=3,
            comment="Test comment"
        )

        response = self.client.post(
            reverse("review_create", kwargs={"pk": self.product.id}),
            {"rating": 3, "comment": "Test comment"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["details"], "Product already reviewed")

    def test_create_product_review_no_rating(self):
        response = self.client.post(
            reverse("review_create", kwargs={"pk": self.product.id}),
            {"rating": 0, "comment": "Test comment"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["details"], "Please select a rating")

    def test_create_product_review(self):
        response = self.client.post(
            reverse("review_create", kwargs={"pk": self.product.id}),
            {"rating": 4, "comment": "Great product!"},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "Review Added")

        self.product.refresh_from_db()
        self.assertEqual(self.product.rating, 4)
        self.assertEqual(self.product.numReviews, 1)

        comment = Comment.objects.get(user=self.user, product=self.product)
        self.assertEqual(comment.rating, 4)
        self.assertEqual(comment.comment, "Great product!")
