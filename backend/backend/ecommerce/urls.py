from django.urls import path
from .views import (
    CustomUserListAPIView,
    CustomUserEditAPIView,
    CreateCommentView,
    readComments,
    RegisterAPIView,
    LoadUserView,
    order_success,
    UpdateOrder,
    OrderListAPIView,
    ProductDetailAPIView,
    ProductListView, CreateProductReview, CreateOrderView, UserOrdersView, GetTopProducts, ProductManager,
    ProductDiscountManager, GetProductsByCategory, CreateCategory, AddWishlistProducts
,ProductStockManager,DeleteProduct,
    CreateProductReview,
DeleteProduct,DeleteComment,
    CreateProductReview,ApproveComment,
    CreateOrderView,
    UserOrdersView,
    GetTopProducts,
    ProductManager,
    ProductDiscountManager,
    CreateRefundRequestView,
    ApproveRefundRequestView,
    CategoryList,
     UserWishlistProducts,
       CreateProduct,
       UserOrderView,
       ProductPriceManager,
     
    ApproveRefundRequestView, CancelOrderView,
    CategoryList,
    ManagerOrderList,
    UpdateOrderStatus,
    CommentListView
)



urlpatterns = [
    # User related
    path('api/register/', RegisterAPIView.as_view(), name='user_register'),
    path('api/users/load/', LoadUserView.as_view(), name='user_load'),
    path('api/users/list/', CustomUserListAPIView.as_view(), name='user_list'),
    path('api/users/edit/', CustomUserEditAPIView.as_view(), name='user_edit'),
    path('api/users/orders/', OrderListAPIView.as_view(), name='order_list'),
    path('api/users/products/', ProductManager.as_view(), name='product_manager'),
    path('api/products/discounts/', ProductDiscountManager.as_view(), name='product_discount_manager'),
    path('api/products/stock/', ProductStockManager.as_view(), name='product_stock_manager'),
    path('api/products/prices/', ProductPriceManager.as_view(), name='product_price_manager'),
    # Product related
    path('api/products/list/', ProductListView.as_view(), name='product_list'),
    path('api/products/detail/', ProductDetailAPIView.as_view(), name='product_detail'),
    path('api/top/', GetTopProducts.as_view(), name='get_top_products'),
    # path('api/products/create/', product_create, name='product_create'),
    # path('api/products/<str:product_id>/update/', product_update, name='product_update'),
    # path('api/products/<str:product_id>/delete/', product_delete, name='product_delete'),
    path('api/products/create/', CreateProduct.as_view(), name='create_product'),
    path("api/products/delete/", DeleteProduct.as_view()),

    # Comment related
    path('api/comments/dashboard/', readComments, name='comment_dashboard'),
    path('api/comments/create/', CreateCommentView.as_view(), name='comment_create'),
    path('api/comments/delete/', DeleteComment.as_view(), name='comment_delete'),
    path('api/comments/approve/', ApproveComment.as_view(), name='comment_approve'),
    # Order related
    path('api/orders/list/', UserOrdersView.as_view(), name='order_list'),
    path('api/orders/cancel/', CancelOrderView.as_view(), name='order_cancel'),
    path('api/orders/create/', CreateOrderView.as_view(), name='order_create'),
    path('api/orders/success/<int:pk>/', order_success, name='order_success'),
    path('api/orders/<int:pk>/update/', UpdateOrder.as_view(), name='order_update'),

    # Review related
    path('api/products/<int:pk>/review/', CreateProductReview.as_view(), name='review_create'),
    path('api/wishlist/list/', UserWishlistProducts.as_view(), name='user_wishlist_products'),
    path('api/wishlist/add/', AddWishlistProducts.as_view(), name='wishlist_create'),

    # Category related
    path('api/category/<int:category_id>/', GetProductsByCategory.as_view(), name='get_products_by_category'),    
    path('api/create_category/', CreateCategory.as_view(), name='create_category'),
    path('api/categories/', CategoryList.as_view(), name='category_list'),
    # Wishlist reletad
    path('api/wishlist/list/', UserWishlistProducts.as_view(), name='user_wishlist_products'),
    path('api/wishlist/add/', AddWishlistProducts.as_view(), name='wishlist_create'),
    path('api/users-orders/', UserOrderView.as_view(), name='wishlist_create'),

        path('api/orders/manager', ManagerOrderList.as_view(), name='order_list'),
        path('api/updateOrderStatus/', UpdateOrderStatus.as_view(), name='update_order_status'),

        path('api/comments/', CommentListView.as_view(), name='comment-list'),
    
    path('api/create-refund-request/', CreateRefundRequestView.as_view(), name='create_refund_request'),
    path('api/approve-refund-request/', ApproveRefundRequestView.as_view(), name='approve_refund_request'),
]


