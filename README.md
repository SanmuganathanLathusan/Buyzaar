# 🛒 Buyzaar – Multi-Vendor E-Commerce Platform

A modern full-stack **MERN Stack Multi-Vendor E-Commerce Platform** that connects customers and vendors in a single online marketplace. Vendors can manage their products, inventory, and orders, while customers can browse products, add items to their cart, place orders, and track purchases through a responsive and user-friendly interface.

---

## 🌐 Live Demo

🔗 **Live Application:** [https://buyzaar-kp8n.vercel.app/]

🔗 **GitHub Repository:** https://github.com/SanmuganathanLathusan/Buyzaar

---

## 🚀 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Context API

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT Authentication

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication & Security

* JWT (JSON Web Tokens)
* Google OAuth Authentication
* Password Hashing with Bcrypt
* Role-Based Access Control (RBAC)

### Cloud Services

* Cloudinary (Image Uploads & Storage)
* Email Service (OTP / Password Reset)

### Deployment

* Vercel (Frontend)
* Render / Railway (Backend)
* MongoDB Atlas (Database)

---

## ✨ Features

### 👤 Customer Features

* User Registration & Login
* Google Sign-In Authentication
* Secure JWT Authentication
* Forgot Password & Reset Password
* Browse Products by Categories
* Search & Filter Products
* Product Details View
* Add to Cart
* Checkout Process
* Order Tracking
* Order History
* Responsive Mobile-Friendly Design

### 🛍️ Vendor Features

* Vendor Registration & Login
* Vendor Dashboard
* Add Products
* Edit Products
* Delete Products
* Inventory Management
* Order Management
* Sales Monitoring

### 🛠️ Admin Features

* Admin Dashboard
* User Management
* Vendor Approval & Verification
* Product Monitoring
* Order Oversight
* Platform Activity Management

---

## 🔐 Authentication & Security

* JWT-Based Authentication
* Google OAuth Login
* Password Hashing using Bcrypt
* Protected API Routes
* Role-Based Authorization
* Secure Environment Variables
* Input Validation & Error Handling

---

## 📂 Project Structure

```bash
Buyzaar/
│
├── frondend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/SanmuganathanLathusan/Buyzaar.git
cd Buyzaar
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Google Authentication
GOOGLE_CLIENT_ID=your_google_client_id

# Frontend URL
CLIENT_URL=http://localhost:3000
```

Run Backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```http
POST /api/orders
GET  /api/orders/user
GET  /api/orders/vendor
```

### Users

```http
GET /api/users/profile
PUT /api/users/profile
```

---



## 🚀 Deployment

### Frontend

* Vercel

### Backend

* Render
* Railway

### Database

* MongoDB Atlas

---

## 🎯 Future Enhancements

* Stripe Payment Gateway Integration
* Product Reviews & Ratings
* Wishlist Functionality
* Real-Time Notifications
* Email Order Notifications
* Advanced Analytics Dashboard
* Multi-Language Support
* AI Product Recommendations

---

## 🧪 Skills Demonstrated

* Full-Stack Web Development
* MERN Stack Development
* REST API Development
* Authentication & Authorization
* Google OAuth Integration
* Email Service Integration
* Database Design & Management
* Cloudinary File Uploads
* Responsive UI/UX Design
* State Management
* Deployment & DevOps Fundamentals

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Lathusan Sanmuganathan**

📧 Email: [lathusanlathusan40@gmail.com](mailto:lathusanlathusan40@gmail.com)

🐙 GitHub: https://github.com/SanmuganathanLathusan

💼 LinkedIn: https://www.linkedin.com/in/lathusan-shanmuganathan-90b89b372/
🌐 Portfolio:https://www.lathusan.me/

---


This project is licensed under the MIT License.
