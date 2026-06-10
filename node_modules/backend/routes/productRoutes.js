const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, getVendorProducts, deleteProduct, createProductReview } = require('../controllers/productController');
const { protect, vendor } = require('../middleware/authMiddleware');

// Specific vendor routes
router.get('/vendor/myproducts', protect, vendor, getVendorProducts);
router.post('/', protect, vendor, createProduct);
router.delete('/:id', protect, vendor, deleteProduct);

// Generic routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
