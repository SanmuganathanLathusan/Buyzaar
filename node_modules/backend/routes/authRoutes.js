const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, googleAuth, addPaymentMethod, deletePaymentMethod } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/payment-methods', protect, addPaymentMethod);
router.delete('/payment-methods/:id', protect, deletePaymentMethod);

module.exports = router;
