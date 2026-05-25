const express = require('express');
const router = express.Router();
const { 
  getAdminDashboardData,
  getAllVendors,
  getAllCustomers,
  getAdminOrders,
  updateVendorStatus,
  updateCustomerStatus
} = require('../controllers/adminController');
const {
  getAllVendorRequests,
  approveVendorRequest,
  rejectVendorRequest
} = require('../controllers/vendorAccessController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard
router.get('/dashboard', protect, admin, getAdminDashboardData);

// Vendors
router.get('/vendors', protect, admin, getAllVendors);
router.put('/vendors/:id', protect, admin, updateVendorStatus);

// Customers
router.get('/customers', protect, admin, getAllCustomers);
router.put('/customers/:id', protect, admin, updateCustomerStatus);

// Orders
router.get('/orders', protect, admin, getAdminOrders);

// Vendor Access Requests
router.get('/vendor-requests', protect, admin, getAllVendorRequests);
router.put('/vendor-requests/:id/approve', protect, admin, approveVendorRequest);
router.put('/vendor-requests/:id/reject', protect, admin, rejectVendorRequest);

module.exports = router;
