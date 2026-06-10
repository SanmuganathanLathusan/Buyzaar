const VendorAccessRequest = require('../models/VendorAccessRequest');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a vendor access request
// @route   POST /api/vendor-access/request
// @access  Public
const submitVendorAccessRequest = async (req, res) => {
  const { fullName, shopName, phone, businessAddress, businessType, email, reason } = req.body;

  try {
    // Check if email already has an approved vendor account
    const existingVendor = await User.findOne({ email, role: 'vendor' });
    if (existingVendor) {
      return res.status(400).json({ message: 'A vendor account already exists for this email. Please log in.' });
    }

    // Check if a pending request already exists for this email
    const existingRequest = await VendorAccessRequest.findOne({ email, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'A pending vendor access request already exists for this email.' });
    }

    const request = await VendorAccessRequest.create({
      fullName,
      shopName,
      phone,
      businessAddress,
      businessType,
      email,
      reason
    });

    res.status(201).json({ message: 'Vendor access request submitted successfully.', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all vendor access requests
// @route   GET /api/admin/vendor-requests
// @access  Private/Admin
const getAllVendorRequests = async (req, res) => {
  try {
    const requests = await VendorAccessRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a vendor access request → create vendor account with temp password
// @route   PUT /api/admin/vendor-requests/:id/approve
// @access  Private/Admin
const approveVendorRequest = async (req, res) => {
  try {
    const request = await VendorAccessRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    // Check if vendor already created (idempotency)
    const existingVendor = await User.findOne({ email: request.email, role: 'vendor' });
    if (existingVendor) {
      request.status = 'approved';
      request.vendorUserId = existingVendor._id;
      await request.save();
      return res.json({ message: 'Vendor account already exists.', temporaryPassword: request.temporaryPassword, request });
    }

    // Generate a human-readable temporary password: 3 words + 4 digits
    const adjectives = ['Swift', 'Bold', 'Bright', 'Cool', 'Sharp', 'Smart', 'Clear', 'Prime'];
    const nouns = ['Shop', 'Store', 'Mart', 'Hub', 'Zone', 'Gate', 'Base', 'Spot'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const temporaryPassword = `${randomAdj}${randomNoun}${randomNum}`;

    // Create the vendor user account
    const newVendor = await User.create({
      name: request.fullName,
      email: request.email,
      password: temporaryPassword,
      role: 'vendor',
      businessName: request.shopName,
      phone: request.phone,
      address: { street: request.businessAddress }
    });

    // Update the request record
    request.status = 'approved';
    request.temporaryPassword = temporaryPassword;
    request.vendorUserId = newVendor._id;
    await request.save();

    // Send email to vendor
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const emailMessage = `
      <h1>Welcome to Buyzaar, ${request.fullName}!</h1>
      <p>Your vendor account for <strong>${request.shopName}</strong> has been approved.</p>
      <p>You can now log in using your registered email and the following temporary password:</p>
      <h3 style="background-color: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${temporaryPassword}</h3>
      <p>Login here: <a href="${clientUrl}/auth" target="_blank">${clientUrl}/auth</a></p>
      <p>For your security, please log in and change your password immediately from your Vendor Dashboard.</p>
    `;

    try {
      await sendEmail({
        email: request.email,
        subject: 'Vendor Account Approved - Temporary Password',
        html: emailMessage
      });
    } catch (emailError) {
      console.error('Failed to send vendor approval email:', emailError);
    }

    res.json({
      message: 'Vendor access approved. Account created and email sent with temporary password.',
      temporaryPassword,
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a vendor access request
// @route   PUT /api/admin/vendor-requests/:id/reject
// @access  Private/Admin
const rejectVendorRequest = async (req, res) => {
  try {
    const request = await VendorAccessRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Vendor access request rejected.', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitVendorAccessRequest,
  getAllVendorRequests,
  approveVendorRequest,
  rejectVendorRequest
};
