const mongoose = require('mongoose');

const vendorAccessRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  businessAddress: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  temporaryPassword: {
    type: String,
    default: null
  },
  vendorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('VendorAccessRequest', vendorAccessRequestSchema);
