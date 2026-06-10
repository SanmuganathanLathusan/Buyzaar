const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const User = require('./models/User');
  const admins = await User.find({ role: 'admin' });
  console.log('Admins:', admins.map(u => ({ email: u.email, role: u.role, name: u.name })));
  const requests = await User.find({ role: 'vendor' });
  console.log('Vendors:', requests.map(u => ({ email: u.email, role: u.role, name: u.name })));
  mongoose.disconnect();
}

run().catch(console.error);
