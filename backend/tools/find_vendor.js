const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const findVendor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const vendor = await User.findOne({ role: 'vendor' });
    if (vendor) {
      console.log('VENDOR_ID=' + vendor._id);
    } else {
      const anyUser = await User.findOne();
      if (anyUser) {
        console.log('VENDOR_ID=' + anyUser._id + ' (Non-vendor)');
      } else {
        console.log('NO_USER_FOUND');
      }
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

findVendor();
