# ecommerce-web
Ecommerce website application

# Ecommerce Website Project

## Overview
This project is an online store application developed as a course project. It provides an interactive platform where users can browse various categories of products, add them to a shopping cart, and complete purchases. The backend of the application handles inventory management and order tracking.

The application is developed using Django for the backend and Next.js for the frontend.

## Detailed Features
1. **Product Browsing**: The application displays products categorized into various groups. Users can select and add products to the shopping cart for purchasing.
2. **Shopping Cart**: Users can add their desired products to the shopping cart and proceed to checkout for purchasing.
3. **Order Tracking**: The system handles order processing from the moment a user places an order to the point the order is delivered. The status of the order is updated at every step and can be viewed by the user.
4. **User Authentication**: Users can browse products and add them to the shopping cart without logging in. However, they are required to log in before placing an order and making a payment.
5. **Product Rating and Review**: Users can leave reviews and give ratings to the products. The review is published after approval by a product manager.
6. **Search and Sort**: Users can search products based on their names or descriptions. They can also sort products based on their price or popularity.
7. **Admin Interface**: The application provides an admin interface for performing managerial tasks.

## Tech Stack
- Backend: Django
- Frontend: Next.js

## Getting Started
### Prerequisites
- Python 3.8 or higher
- Node.js 12.0 or higher

### Setup and Installation
1. Clone the repository to your local machine


   ```bash
   
   git clone https://github.com/kyuceak/ecommerce-web.git

2.Navigate into the project directory and install the backend dependencies:


  cd backend
  
  pip install -r requirements.txt

3.Navigate into the frontend directory and install the frontend dependencies:


  cd frontend
  
  npm install
  
4.Run the backend server:


  python manage.py runserver
  
5.In a new terminal, run the frontend server:


  cd frontend
  
  npm run dev

You can now visit localhost:3000 in your web browser to view the application.

### Security
This project implements security measures for handling sensitive data such as user passwords, credit card information, and user accounts. Encryption is employed to protect this data. However credit card card verification and limitation is beyond the scope of this project.
