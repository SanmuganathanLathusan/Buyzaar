const express = require('express');
const router = express.Router();
const { getAdminDashboardData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getAdminDashboardData);

module.exports = router;
