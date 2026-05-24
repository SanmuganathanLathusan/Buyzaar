const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getVendorOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

// More specific routes first
router.get('/myorders', protect, getMyOrders);
router.get('/vendor', protect, vendor, getVendorOrders);
router.post('/', protect, createOrder);
router.put('/:id/status', protect, vendor, updateOrderStatus);

// Generic admin route (must be last)
router.get('/', protect, admin, getAllOrders);

module.exports = router;
