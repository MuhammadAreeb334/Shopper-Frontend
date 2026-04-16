# Shopper – Frontend (E-Commerce Application)

## Overview
This is the complete frontend for my Shopper e-commerce application. I built it using React and Vite to create a fast, responsive shopping experience. Users can browse products, manage their cart, create accounts, and complete purchases through Stripe payments.

The frontend connects to a backend API that handles all the heavy lifting such as products, user data, cart operations, and payment processing.

---

## What I Used to Build This

I chose Vite with React because it provides a fast development environment with Hot Module Replacement (HMR). Every time I save a file, the changes appear instantly in the browser without needing a manual refresh.

---

## Features I've Implemented

Here are the main features of the application:

- Browse all products and view individual product details  
- Add products to cart and remove them when needed  
- Create a new account or log into an existing account  
- Cart total updates automatically as items are added or removed  
- Complete payments using Stripe checkout  
- Full integration with backend APIs for data handling  
- Responsive design for mobile and desktop devices  
- Global state management using React Context API  

---

## Environment Variables You Need

Before running the project, create a `.env` file in the root directory and add the following variables:

VITE_GOOGLE_CLIENT_ID=""
GOOGLE_SECRET_KEY=""

---

## Getting It Running Locally

Follow these steps to run the project on your local machine:

### 1. Clone the repository
git clone https://github.com/MuhammadAreeb334/Shopper-Frontend.git  
cd Shopper-Frontend  

### 2. Install dependencies
npm install  

### 3. Start the development server
npm run dev  

Once the server is running, open your browser and go to:
http://localhost:5173  

---

## Connecting to the Backend

This frontend requires a backend server to function properly. The backend handles:

- User registration and login using JWT authentication  
- Product listing and search functionality  
- Cart operations (add, remove, update quantity)  
- Stripe checkout session creation and payment processing  

Make sure the backend server is running before testing features that depend on API calls. Both frontend and backend must run simultaneously for full functionality.

---

## How Payments Work

The Stripe payment flow works in the following steps:

1. You add products to your cart  
2. When ready, you click the checkout button  
3. The frontend sends cart data to the backend  
4. The backend creates a Stripe checkout session and returns a URL  
5. You are redirected to Stripe’s secure payment page  
6. Stripe processes the payment securely  
7. The backend receives a webhook confirmation and clears the cart  
8. You are redirected to a success page  

Your payment details never touch my server. Stripe handles all sensitive information securely.

---

## Live Demo

The frontend is deployed and available here:
https://shopper-clothings.vercel.app/

You can test the payment flow using Stripe test mode:

Test Card Number: 4242 4242 4242 4242  
Use any future expiry date and any CVC.

---

## Notes

This project is built using Vite and React for performance and scalability. The structure is designed to be clean and maintainable, making it easy to extend with new features such as wishlist, order history, and admin dashboard in the future.