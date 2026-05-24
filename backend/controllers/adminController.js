const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get complete admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardData = async (req, res) => {
  try {
    // 1. Total Revenue (Aggregated from all completed orders)
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, current) => acc + (current.totalPrice || 0), 0);

    // 2. Active Customers & Registered Vendors lookup
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });

    // 3. Platform Traffic Metric (Tracking Volume using Total Database Orders)
    const totalOrders = orders.length;

    // 4. Compile the Recent Vendor Registrations Table
    const recentVendorsList = await User.find({ role: 'vendor' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name businessName createdAt');

    // Process the data for the frontend mapping structure
    const vendorsWithRevenue = recentVendorsList.map((v) => {
      return {
        id: v._id,
        name: v.businessName || v.name,
        plan: 'Standard',
        joinDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
        status: 'Active',
        revenue: 'Rs. 0'
      };
    });

    res.json({
      totalRevenue,
      totalCustomers,
      totalVendors,
      totalOrders,
      recentVendors: vendorsWithRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vendor status
// @route   PUT /api/admin/vendors/:id
// @access  Private/Admin
const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor status updated', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend/Unsuspend customer
// @route   PUT /api/admin/customers/:id
// @access  Private/Admin
const updateCustomerStatus = async (req, res) => {
  try {
    const { suspended } = req.body;
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { suspended },
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer status updated', customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAdminDashboardData,
  getAllVendors,
  getAllCustomers,
  getAdminOrders,
  updateVendorStatus,
  updateCustomerStatus
};
