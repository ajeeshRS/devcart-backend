# DevCart

## Overview

DevCart, a Streamlined eCommerce powered by MongoDB, Express, React, and Node.It is a React-based application designed to provide a seamless shopping experience and a robust backend for managing products, orders, and payments.

## Features

- User Authentication (Sign Up, Login, Logout)
- Product Browsing and Filtering
- Shopping Cart Management
- Online payment using Razorpay
- Responsive Design for Mobile and Desktop

## Technologies Used

- React.js
- Material UI for styling
- Axios for API requests
- Node.js
- Express.js
- MongoDB
- Razorpay
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Frontend repo : https://github.com/ajeeshRS/devcart-frontend.git


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ajeeshRS/devcart-backend.git

2. Go inside the file :

   ```bash
   cd devcart-backend

3. Install dependencies :

   ```bash
   npm install

3. Create a .env file and Paste this and update with your credentials  :

   ```bash
   PORT=3001
   MONGODB_URI='YOUR_MONGO_URI'
   ACCESS_KEY = 'YOUR USER JWT SECRET'
   ADMIN_ACCESS_KEY='YOUR ADMIN JWT SECRET'
   KEY_ID='YOUR RAZORPAY ID'
   KEY_SECRET='YOUR RAZORPAY SECRET'

5. Running the application:

   ```bash
   npm start
