const express = require('express');
const router = express.Router();
const { submitVendorAccessRequest } = require('../controllers/vendorAccessController');

// Public — no auth needed to submit a request
router.post('/request', submitVendorAccessRequest);

module.exports = router;
