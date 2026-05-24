import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Store, Activity, Settings, LogOut, ShieldCheck, Mail, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // State Management
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalOrders: 0,
    recentVendors: []
  });

  // Initial Auth Check & Dashboard Load
  useEffect(() => {
    let isMounted = true;

    const checkAuthAndFetchData = async () => {
      if (!token || user?.role !== 'admin') {
        if (isMounted) navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (isMounted) setDashboardData(data);
        } else if (res.status === 401 || res.status === 403) {
          if (isMounted) navigate('/login');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuthAndFetchData();
    return () => { isMounted = false; };
  }, [token, user, navigate, API_BASE]);

  // Fetch Vendors
  const fetchVendors = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/vendors`);
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      } else {
        toast.error('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Could not load vendors');
    }
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        toast.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Could not load customers');
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Could not load orders');
    }
  };

  // Toggle Customer Suspension
  const toggleCustomerStatus = async (customerId, currentStatus) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify({ suspended: !currentStatus })
      });

      if (res.ok) {
        toast.success(currentStatus ? 'Customer unsuspended' : 'Customer suspended');
        fetchCustomers();
      } else {
        toast.error('Failed to update customer status');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Could not update customer');
    }
  };

  // Handle Section Switch
  const handleSectionSwitch = (section) => {
    setActiveSection(section);
    if (section === 'vendors') fetchVendors();
    if (section === 'customers') fetchCustomers();
    if (section === 'orders') fetchOrders();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formattedStats = [
    { title: 'Total Revenue (Platform)', value: `Rs. ${dashboardData.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/20' },
    { title: 'Registered Vendors', value: dashboardData.totalVendors.toLocaleString(), icon: Store, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/20' },
    { title: 'Active Customers', value: dashboardData.totalCustomers.toLocaleString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/20' },
    { title: 'Platform Traffic (Orders)', value: dashboardData.totalOrders.toLocaleString(), icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30 border-amber-100 dark:border-amber-900/20' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Suspended':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-slate-400 font-medium">Loading admin control panel…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col md:flex-row pb-12 md:pb-0">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-400 md:h-screen md:sticky md:top-16 flex flex-col">
        <div className="p-6 border-b border-slate-900">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Admin Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Platform Operations</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button 
            onClick={() => handleSectionSwitch('overview')}
            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'overview' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <Activity size={18} /> Overview
          </button>
          <button 
            onClick={() => handleSectionSwitch('vendors')}
            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'vendors' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <Store size={18} /> Vendors
          </button>
          <button 
            onClick={() => handleSectionSwitch('customers')}
            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'customers' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <Users size={18} /> Customers
          </button>
          <button 
            onClick={() => handleSectionSwitch('orders')}
            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'orders' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <DollarSign size={18} /> Orders
          </button>
          <button 
            onClick={() => handleSectionSwitch('settings')}
            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'settings' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <Settings size={18} /> Platform Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <>
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Admin Overview</h1>
                <p className="text-sm text-slate-500">Global metrics and platform health.</p>
              </div>
              <button className="btn-secondary btn-md rounded-xl gap-2 font-bold bg-white dark:bg-slate-800 border border-border dark:border-border-dark shadow-card">
                <Mail size={16} /> Send Broadcast
              </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {formattedStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-border dark:border-border-dark shadow-card"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                      <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight">{stat.value}</h3>
                    </div>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold text-secondary dark:text-white">Recent Vendor Registrations</h3>
                <button onClick={() => handleSectionSwitch('vendors')} className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors">Manage All Vendors</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                      <th className="px-6 py-4">Vendor / Shop Name</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4">Gross Revenue</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {dashboardData.recentVendors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-400">No vendors registered yet.</td>
                      </tr>
                    ) : (
                      dashboardData.recentVendors.map((vendor, i) => (
                        <tr key={i} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{vendor.name}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{vendor.plan}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">{vendor.joinDate}</td>
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{vendor.revenue}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(vendor.status)}`}>{vendor.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-sm text-primary hover:text-primary-hover font-semibold">Review</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VENDORS SECTION */}
        {activeSection === 'vendors' && (
          <div>
            <header className="mb-8">
              <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Vendor Management</h1>
              <p className="text-sm text-slate-500">Manage all registered vendors on the platform.</p>
            </header>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h3 className="text-lg font-bold text-secondary dark:text-white">All Vendors ({vendors.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Business</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {vendors.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">No vendors found.</td>
                      </tr>
                    ) : (
                      vendors.map((vendor) => (
                        <tr key={vendor._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{vendor.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{vendor.businessName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{vendor.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-sm text-primary hover:text-primary-hover font-semibold">View</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS SECTION */}
        {activeSection === 'customers' && (
          <div>
            <header className="mb-8">
              <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Customer Management</h1>
              <p className="text-sm text-slate-500">Manage all registered customers on the platform.</p>
            </header>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h3 className="text-lg font-bold text-secondary dark:text-white">All Customers ({customers.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">No customers found.</td>
                      </tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{customer.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{customer.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{new Date(customer.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${customer.suspended ? getStatusColor('Suspended') : getStatusColor('Active')}`}>
                              {customer.suspended ? 'Suspended' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => toggleCustomerStatus(customer._id, customer.suspended)}
                              className={`text-sm font-semibold flex items-center gap-1 ${customer.suspended ? 'text-emerald-600 hover:text-emerald-700' : 'text-red-600 hover:text-red-700'}`}
                            >
                              <ToggleRight size={16} /> {customer.suspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS SECTION */}
        {activeSection === 'orders' && (
          <div>
            <header className="mb-8">
              <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Order Management</h1>
              <p className="text-sm text-slate-500">View all orders placed on the platform.</p>
            </header>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h3 className="text-lg font-bold text-secondary dark:text-white">All Orders ({orders.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Total Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-400">No orders found.</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{order._id?.slice(-8)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.customer?.name}</td>
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">Rs. {order.totalPrice}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-sm text-primary hover:text-primary-hover font-semibold">Details</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS SECTION */}
        {activeSection === 'settings' && (
          <div>
            <header className="mb-8">
              <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Platform Settings</h1>
              <p className="text-sm text-slate-500">Configure platform-wide settings and preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Commission Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Vendor Commission Rate (%)</label>
                    <input type="number" placeholder="10" className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark dark:bg-slate-900 text-secondary dark:text-white" />
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Send order notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Send vendor updates</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
