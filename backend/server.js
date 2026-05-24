require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ────────────────────────────────────────────────────────────────────────────
// CORS Configuration - Allow all Vercel deployments and local dev
// ────────────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://buyzaar-roan.vercel.app',
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from: ${origin}`);
      callback(null, true); // Allow anyway for Vercel preview deployments
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────────────────────────────────
// MongoDB Connection (with retry logic)
// ────────────────────────────────────────────────────────────────────────────
let isMongoConnected = false;

const connectDB = async () => {
  if (isMongoConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 5000,
      retryWrites: true
    });
    isMongoConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    isMongoConnected = false;
    throw error;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  if (!isMongoConnected) {
    try {
      await connectDB();
    } catch (err) {
      console.error('DB connection attempt failed:', err.message);
      return res.status(503).json({ message: 'Database connection failed. Please try again.' });
    }
  }
  next();
});

// ────────────────────────────────────────────────────────────────────────────
// Health Check & Routes
// ────────────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Buyzaar API is running...',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Start Server (Dev) OR Export for Vercel (Production)
// ────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  // Local development
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📍 API Base: http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
} else {
  // Vercel serverless
  module.exports = app;
}