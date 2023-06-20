from rest_framework import serializers
from .models import CustomUser, Product, Comment, Order, OrderItem, Category


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'id', 'email', 'password', 'nameSurname', 'taxID', 'address', 'role')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username']
        )
        return user


'''
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
'''


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'from_user', 'to_product', 'comment', 'rating', 'created_date', 'isApproved']
        read_only_fields = ['id', 'from_user', 'to_product', 'created_date']

    def create(self, validated_data):
        request = self.context.get('request')
        comment = Comment.objects.create(
            from_user=request.user,
            to_product=validated_data['to_product'],
            comment=validated_data['comment'],
            rating=validated_data['rating']
        )
        return comment


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def update(self, instance, validated_data):
        if instance.from_user != self.context['request'].user:
            raise serializers.ValidationError('You do not have permission to edit this comment')
        instance.comment = validated_data.get('comment', instance.comment)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.save()
        return instance


class ProductSerializerWithAllReview(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True, source='comment_set')  # Uncomment and set the source

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'image', 'brand', 'category', 'description', 'price', 'count_in_stock',
                  'createdAt', 'warranty', 'rating', 'numReviews', 'reviews', 'discount', 'initial_price']

    def get_reviews(self, obj):
        comments = obj.comment_set.filter()
        serializer = CommentSerializer(comments, many=True)
        return serializer.data


# class ProductSerializerWithAllReview(serializers.ModelSerializer):
#     reviews = serializers.SerializerMethodField(read_only=True, source='comment_set')
#     total_sales_amount = serializers.SerializerMethodField(read_only=True)
#     total_quantity_sold = serializers.SerializerMethodField(read_only=True)
#
#     class Meta:
#         model = Product
#         fields = ['id', 'product_name', 'image', 'brand', 'category', 'description', 'price', 'count_in_stock',
#                   'createdAt', 'warranty', 'rating', 'numReviews', 'reviews', 'total_sales_amount', 'total_quantity_sold']
#
#     def get_reviews(self, obj):
#         comments = obj.comment_set.filter()
#         serializer = CommentSerializer(comments, many=True)
#         return serializer.data
#
#     def get_total_sales_amount(self, obj):
#         total = OrderItem.objects.filter(product=obj).annotate(sale_amount=F('qty')*F('product__price')).aggregate(total_sale=Sum('sale_amount'))
#         return total.get('total_sale') or 0
#
#     def get_total_quantity_sold(self, obj):
#         total = OrderItem.objects.filter(product=obj).aggregate(total_quantity=Sum('qty'))
#         return total.get('total_quantity') or 0

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True, source='get_reviews')  # Uncomment and set the source
    wishlist = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all(), required=False)

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'image', 'brand', 'category', 'description', 'price', 'count_in_stock',
                  'createdAt', 'warranty', 'rating', 'numReviews', 'reviews', 'wishlist', 'discount', 'initial_price']

    def get_reviews(self, obj):
        comments = obj.comment_set.filter(isApproved=True)
        serializer = CommentSerializer(comments, many=True)
        return serializer.data


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('product', 'qty', 'product_name', 'image','price')


class OrderSerializer(serializers.ModelSerializer):
    orderitems = OrderItemSerializer(many=True, source='orderitem_set', read_only=True)

    user = CustomUserSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ('id', 'user','paymentMethod', 'card_no', 'card_cvk', 'orderitems', 'status', 'createdAt', 'total_price')


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['name', 'products']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']


class ProductSerializerToCreate(serializers.ModelSerializer):
    field_name = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = ['product_name', 'brand', 'category', 'count_in_stock', 'image', 'price', 'warranty', 'description']

    def create(self, validated_data):
        # Extract the field value from validated_data
        field_value = validated_data.pop('field_name', None)
        # Perform any necessary processing or validation
        # ...
        # Create the product instance
        product = Product.objects.create(**validated_data)
        # Assign the field value to the product instance
        product.field_name = field_value
        # Save the product instance
        product.save()
        return product


class CreateProductSerializerDenemeBilmemKac(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True)

    class Meta:
        model = Product
        fields = ['product_name', 'brand', 'category', 'count_in_stock', 'image', 'initial_price', 'warranty',
                  'description']

    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        return product


class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)

class OrderItemManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product', 'qty', 'price')

class OrderManagerSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    orders = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'orders']


class OrderItemManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product', 'qty', 'price')

class OrderManagerSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    orders = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id','user', 'paymentMethod', 'card_no', 'card_cvk', 'createdAt', 'status', 'total_price', 'orders')
      
class CommentSerializerWithUser(serializers.ModelSerializer):

    from_user = serializers.StringRelatedField()
    to_product = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ['id','from_user', 'to_product', 'comment', 'rating', 'created_date', 'isApproved']