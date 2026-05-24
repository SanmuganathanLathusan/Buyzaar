require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ────────────────────────────────────────────────────────────────────────────
// App Setup
// ────────────────────────────────────────────────────────────────────────────
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────────────────────────────────
// MongoDB Connection (Singleton Pattern for Serverless)
// ────────────────────────────────────────────────────────────────────────────
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });

    cachedConnection = conn;
    console.log('✅ MongoDB Connected');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB connection failed:', error.message);
    res.status(503).json({ 
      message: 'Database unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Import Routes
// ────────────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ────────────────────────────────────────────────────────────────────────────
// Health Check
// ────────────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Buyzaar API is running...',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ────────────────────────────────────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ────────────────────────────────────────────────────────────────────────────
// 404 Handler
// ────────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Error Handler
// ────────────────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Start Server (Dev) OR Export for Vercel (Serverless)
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
}

// Always export the app (needed for both local and Vercel)
module.exports = app;