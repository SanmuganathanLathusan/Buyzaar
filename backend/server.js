require('dotenv').config({ 
  path: require('path').join(__dirname, '.env') 
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Middleware
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const corsOptions =
  process.env.NODE_ENV === 'production'
    ? {
        origin: CLIENT_URL,
        credentials: true,
      }
    : {
        origin: true,
        credentials: true,
      };

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Buyzaar API is running...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);

    isConnected = true;

    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
  }
};

// Connect database for every serverless function call
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Export app for Vercel
module.exports = app;

// Run locally only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}