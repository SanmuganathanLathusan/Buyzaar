const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Product = require('./models/Product');

const cleanup = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Find products to delete:
    // 1. Image is empty or just whitespace
    // 2. Image starts with a common placeholder URL
    // 3. Image contains "No Image" text (from placehold.co)
    const results = await Product.deleteMany({
      $or: [
        { image: { $exists: false } },
        { image: "" },
        { image: null },
        { image: /^\s*$/ },
        { image: /placehold/i },
        { image: /placeholder/i },
        { image: /none/i },
        { image: /null/i },
        { image: /undefined/i },
        { image: { $not: /^(http|\/uploads)/i } } 
      ]
    });

    console.log(`✅ Cleanup complete. Removed ${results.deletedCount} products without valid images.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

cleanup();
