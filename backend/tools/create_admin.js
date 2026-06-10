const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const User = require('./models/User');
  
  const existingAdmin = await User.findOne({ email: 'admin@buyzaar.com' });
  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.email);
  } else {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@buyzaar.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created successfully: admin@buyzaar.com / password123');
  }
  
  mongoose.disconnect();
}

run().catch(console.error);
