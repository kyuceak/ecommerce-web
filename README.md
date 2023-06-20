# ecommerce-web
Ecommerce website application


# Online Store Project

## Project Description
This repository contains an online store application, designed as a course project. The application serves as a platform for users to browse products, add them to their cart, and complete purchases. The store's inventory is managed by product managers and sales are overseen by sales managers.

## Features
- Browse products by categories
- Shopping cart functionality
- User login and authentication
- Order tracking from processing to delivery
- Product rating and commenting (comments are approved by product managers)
- Search and sort products by name, description, price, and popularity
- Admin interface for managing the store
- User roles include customers, sales managers, and product managers

## Technology Stack
- Front-end: Next.js
- Back-end: Django

## Setup

### Requirements
- Python 3.8 or higher
- Node.js 12.0 or higher

### Installation
1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/onlinestoreproject.git
   
2. Install the dependencies. For the Django backend:
   pip install -r requirements.txt

   And for the Next.js:
   cd frontend
   npm install

3. Run the Django backend:
   python manage.py runserver

4.Run the Next.js frontend:
  cd frontend
  npm run dev

###Usage

Visit localhost:3000 in your web browser to access the store

###Security
This project includes measures to protect sensitive data such as user passwords and credit card information. However, credit card verification and limit issues are beyond the scope of this project.

