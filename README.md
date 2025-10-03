
# E-Commerce-Api

This is a backend API for an e-commerce platform, built with Node.js and Express. It provides core functionalities for user authentication, product management, cart operations, and payment processing using Stripe.

-----

### Features

  - **User Authentication:** Secure user registration, login, token refreshing, and logout using JWT (JSON Web Tokens) and bcrypt for password hashing.
  - **Product Management:** Endpoints for creating, updating, deleting, listing, and getting products by ID.
  - **Shopping Cart:** Functionality to add, remove, and clear items from a user's cart (protected routes).
  - **Payment Integration:** Creates a checkout session using Stripe to process payments and handles webhook events for payment completion.
  - **Database:** Uses MongoDB as the database with Mongoose for schema management.
  - **Error Handling:** Centralized error handling using a custom `ApiError` class and an `asyncHandler` utility to wrap controller functions.

-----

### Technologies Used

  * **Node.js**
  * **Express**
  * **MongoDB**
  * **Mongoose**
  * **bcrypt**
  * **jsonwebtoken**
  * **Stripe**
  * **dotenv**

-----

### Prerequisites

  * Node.js (\>= 18)
  * MongoDB
  * Stripe Account

-----

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/amansharma264/e-commerce-api
    cd E-Commerce-Api
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add the environment variables.

4.  **Run the development server:**

    ```sh
    npm run dev
    ```

    This will start the server and connect to your MongoDB database. The server will run on the port specified in your `.env` file, or port 8080 by default.

-----

### Environment Variables

You need to create a `.env` file with the following variables:

| Variable | Description |
| :--- | :--- |
| `PORT` | The port for the server to run on (e.g., `8080`). |
| `MONGODB_URI` | The connection string for your MongoDB database. |
| `DB_NAME` | The name of the database, which is "ecommerceapi". |
| `CORS_ORIGIN` | The allowed origin for CORS (e.g., `http://localhost:3000`). |
| `ACCESS_TOKEN_SECRET` | A secret key for signing JWT access tokens. |
| `ACCESS_TOKEN_EXPIRY` | The expiration time for access tokens (e.g., `15m`). |
| `REFRESH_TOKEN_SECRET`| A secret key for signing JWT refresh tokens. |
| `REFRESH_TOKEN_EXPIRY`| The expiration time for refresh tokens (e.g., `7d`). |
| `STRIPE_SECRET_KEY` | Your Stripe secret API key. |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook signing secret. |

-----

### API Endpoints

All API endpoints are prefixed with `/api/v1`.

#### 🔐 **Authentication**

  - `POST /api/v1/auth/register`: Register a new user.
  - `POST /api/v1/auth/login`: Login a user.
  - `POST /api/v1/auth/refresh-token`: Refresh the access token.
  - `POST /api/v1/auth/logout`: Logout a user (protected route).

#### 🛒 **Products**

  - `GET /api/v1/products/`: List all products.
  - `GET /api/v1/products/:id`: Get a product by ID.
  - `POST /api/v1/products/`: Create a new product.
  - `PUT /api/v1/products/:id`: Update a product by ID.
  - `DELETE /api/v1/products/:id`: Delete a product by ID.

#### 🛒 **Cart**

  - `GET /api/v1/cart/`: Get the user's cart content (protected).
  - `POST /api/v1/cart/add`: Add an item to the cart (protected).
  - `POST /api/v1/cart/remove`: Remove an item from the cart (protected).
  - `DELETE /api/v1/cart/clear`: Clear the entire cart (protected).

#### 💳 **Payment**

  - `POST /api/v1/payment/create-checkout-session`: Create a Stripe checkout session for the user's cart (protected).
  - `POST /api/v1/payment/webhook`: Public webhook endpoint for Stripe to handle payment events.






[﻿# E-Commerce-Api
# E-Commerce-Api

](https://roadmap.sh/projects/ecommerce-api)

