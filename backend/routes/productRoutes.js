const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, getVendorProducts, deleteProduct } = require('../controllers/productController');
const { protect, vendor } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/vendor/myproducts', protect, vendor, getVendorProducts);
router.post('/', protect, vendor, createProduct);
router.get('/:id', getProductById);
router.delete('/:id', protect, vendor, deleteProduct);

module.exports = router;
