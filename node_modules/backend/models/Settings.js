const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  commissionRate: {
    type: Number,
    required: true,
    default: 10
  },
  sendOrderNotifications: {
    type: Boolean,
    default: true
  },
  sendVendorUpdates: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
