const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getVendorOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/vendor', protect, vendor, getVendorOrders);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, vendor, updateOrderStatus);

module.exports = router;
