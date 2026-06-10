import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Store, Activity, Settings, LogOut, ShieldCheck, Mail, ToggleRight, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

  // State Management
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([]);
  
  // Vendor View States
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [isViewingVendor, setIsViewingVendor] = useState(false);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalOrders: 0,
    recentVendors: []
  });

  const [platformSettings, setPlatformSettings] = useState({
    commissionRate: 10,
    sendOrderNotifications: true,
    sendVendorUpdates: true,
    maintenanceMode: false
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

  // Fetch Vendor Requests
  const fetchVendorRequests = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/vendor-requests`);
      if (res.ok) {
        const data = await res.json();
        setVendorRequests(data);
      } else {
        toast.error('Failed to fetch vendor access requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Could not load vendor requests');
    }
  };

  // Approve Vendor Access Request
  const handleApproveRequest = async (requestId) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/vendor-requests/${requestId}/approve`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Request approved! Temporary password generated: ${data.temporaryPassword}`, { duration: 10000 });
        fetchVendorRequests();
      } else {
        toast.error(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Could not approve request');
    }
  };

  // Reject Vendor Access Request
  const handleRejectRequest = async (requestId) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/vendor-requests/${requestId}/reject`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Vendor request rejected');
        fetchVendorRequests();
      } else {
        toast.error(data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Could not reject request');
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/settings`);
      if (res.ok) {
        const data = await res.json();
        setPlatformSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Update Settings
  const handleUpdateSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        body: JSON.stringify(platformSettings)
      });

      if (res.ok) {
        toast.success('Platform settings updated successfully!');
        fetchSettings();
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Could not connect to server');
    }
  };

  // Fetch Vendor Details
  const fetchVendorDetails = async (vendorId) => {
    setIsVendorLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/vendors/${vendorId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedVendorDetails(data);
        setIsViewingVendor(true);
      } else {
        toast.error('Failed to load vendor details');
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast.error('Could not connect to server');
    } finally {
      setIsVendorLoading(false);
    }
  };

  // Handle Section Switch
  const handleSectionSwitch = (section) => {
    setActiveSection(section);
    setIsViewingVendor(false); // Reset vendor view on section switch
    if (section === 'vendors') fetchVendors();
    if (section === 'customers') fetchCustomers();
    if (section === 'orders') fetchOrders();
    if (section === 'vendor-requests') fetchVendorRequests();
    if (section === 'settings') fetchSettings();
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
      <aside className="w-full md:w-64 bg-slate-950 text-slate-400 md:h-screen md:sticky md:top-0 flex flex-col">
        <div className="p-6 border-b border-slate-900">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Admin Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Platform Operations</p>
        </div>

        <div className="px-4 pt-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20"
          >
            <Home size={18} /> Return to Shop
          </button>
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
            onClick={() => handleSectionSwitch('vendor-requests')}
            className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeSection === 'vendor-requests' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'}`}
          >
            <ShieldCheck size={18} /> Vendor Requests
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
        {activeSection === 'vendors' && !isViewingVendor && (
          <div>
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Vendor Management</h1>
                <p className="text-sm text-slate-500">Manage all registered vendors on the platform.</p>
              </div>
              <Activity className="text-primary/20 w-12 h-12" />
            </header>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold text-secondary dark:text-white">All Vendors ({vendors.length})</h3>
                <div className="flex bg-surface-muted dark:bg-slate-900/50 p-1 rounded-lg">
                   <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 rounded shadow-sm">All</button>
                   <button className="px-3 py-1 text-xs font-bold text-slate-400">Active</button>
                   <button className="px-3 py-1 text-xs font-bold text-slate-400">Blocked</button>
                </div>
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
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{vendor.businessName}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{vendor.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => fetchVendorDetails(vendor._id)}
                              disabled={isVendorLoading}
                              className="text-sm text-primary hover:text-primary-hover font-bold flex items-center gap-1 ml-auto"
                            >
                              {isVendorLoading ? '...' : 'View Details'}
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

        {/* VENDOR DETAILS VIEW */}
        {activeSection === 'vendors' && isViewingVendor && selectedVendorDetails && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <header className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => setIsViewingVendor(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-border dark:border-border-dark shadow-sm hover:text-primary transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">{selectedVendorDetails.vendor.businessName}</h1>
                <p className="text-sm text-slate-500 font-medium">Owner: {selectedVendorDetails.vendor.name} • Registered on {new Date(selectedVendorDetails.vendor.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="ml-auto flex gap-3">
                 <button className="btn-secondary btn-sm rounded-xl font-bold bg-white dark:bg-slate-800">Edit Vendor</button>
                 <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">Block Shop</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Products Listed</p>
                  <h3 className="text-2xl font-black text-secondary dark:text-white">{selectedVendorDetails.stats.totalProducts}</h3>
               </div>
               <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Orders</p>
                  <h3 className="text-2xl font-black text-secondary dark:text-white">{selectedVendorDetails.stats.totalOrders}</h3>
               </div>
               <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated Revenue</p>
                  <h3 className="text-2xl font-black text-emerald-500">Rs. {selectedVendorDetails.stats.totalRevenue.toLocaleString()}</h3>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Products Table */}
               <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-border-dark bg-surface-muted/30">
                     <h3 className="font-black text-secondary dark:text-white text-sm uppercase tracking-wider">Product Inventory</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[400px]">
                     <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase text-slate-400 border-b border-border dark:border-border-dark">
                           <tr>
                              <th className="px-4 py-3">Product</th>
                              <th className="px-4 py-3">Price</th>
                              <th className="px-4 py-3 text-right">Stock</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                           {selectedVendorDetails.products.length === 0 ? (
                              <tr><td colSpan="3" className="px-4 py-10 text-center text-slate-400 text-sm italic">No products uploaded.</td></tr>
                           ) : (
                              selectedVendorDetails.products.map(p => (
                                 <tr key={p._id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-4 py-3 flex items-center gap-3">
                                       <img src={p.image} className="w-8 h-8 rounded bg-slate-100 object-cover" />
                                       <span className="font-bold text-secondary dark:text-white truncate max-w-[120px]">{p.title}</span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Rs. {p.price}</td>
                                    <td className="px-4 py-3 text-right">
                                       <span className={`font-bold ${p.stock < 5 ? 'text-red-500' : 'text-slate-400'}`}>{p.stock}</span>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Associated Orders */}
               <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-border-dark bg-surface-muted/30">
                     <h3 className="font-black text-secondary dark:text-white text-sm uppercase tracking-wider">Vendor Orders</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[400px]">
                     <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase text-slate-400 border-b border-border dark:border-border-dark">
                           <tr>
                              <th className="px-4 py-3">Order ID</th>
                              <th className="px-4 py-3">Customer</th>
                              <th className="px-4 py-3 text-right">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                           {selectedVendorDetails.orders.length === 0 ? (
                              <tr><td colSpan="3" className="px-4 py-10 text-center text-slate-400 text-sm italic">No orders for this vendor yet.</td></tr>
                           ) : (
                              selectedVendorDetails.orders.map(o => (
                                 <tr key={o._id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-4 py-3 font-bold text-primary">#{o._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{o.customer?.name}</td>
                                    <td className="px-4 py-3 text-right">
                                       <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusColor(o.status)}`}>{o.status}</span>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </motion.div>
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

        {/* VENDOR ACCESS REQUESTS SECTION */}
        {activeSection === 'vendor-requests' && (
          <div>
            <header className="mb-8">
              <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Vendor Access Requests</h1>
              <p className="text-sm text-slate-500">Review and approve vendor access requests. Approved vendors will automatically get an account with a temporary password generated.</p>
            </header>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h3 className="text-lg font-bold text-secondary dark:text-white">All Requests ({vendorRequests.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                      <th className="px-6 py-4">Request Info</th>
                      <th className="px-6 py-4">Shop details</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Temp Password</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {vendorRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-400">No requests found.</td>
                      </tr>
                    ) : (
                      vendorRequests.map((req) => (
                        <tr key={req._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors align-top">
                          <td className="px-6 py-4 space-y-1">
                            <div className="text-sm font-bold text-secondary dark:text-white">{req.fullName}</div>
                            <div className="text-xs text-slate-500">{req.email}</div>
                            <div className="text-xs text-slate-500">{req.phone}</div>
                            <div className="text-[10px] text-slate-400">{new Date(req.createdAt).toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <div className="text-sm font-semibold text-secondary dark:text-white">{req.shopName}</div>
                            <div className="text-xs text-slate-500"><span className="font-bold">Type:</span> {req.businessType}</div>
                            <div className="text-xs text-slate-500"><span className="font-bold">Addr:</span> {req.businessAddress}</div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs whitespace-pre-wrap leading-relaxed">
                              {req.reason}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                              req.status === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
                                : req.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30'
                                : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {req.temporaryPassword ? (
                              <div className="flex items-center gap-2">
                                <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono text-primary font-bold">
                                  {req.temporaryPassword}
                                </code>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(req.temporaryPassword);
                                    toast.success('Copied temporary password!');
                                  }}
                                  className="text-xs text-slate-400 hover:text-primary"
                                  title="Copy Password"
                                >
                                  📋
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleApproveRequest(req._id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req._id)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Processed</span>
                            )}
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
              <form onSubmit={handleUpdateSettings} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Commission Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Vendor Commission Rate (%)</label>
                    <input 
                      type="number" 
                      value={platformSettings.commissionRate}
                      onChange={(e) => setPlatformSettings({...platformSettings, commissionRate: e.target.value})}
                      placeholder="10" 
                      className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark dark:bg-slate-900 text-secondary dark:text-white" 
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                    Save Settings
                  </button>
                </div>
              </form>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card">
                <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={platformSettings.sendOrderNotifications}
                      onChange={(e) => {
                        const newSettings = {...platformSettings, sendOrderNotifications: e.target.checked};
                        setPlatformSettings(newSettings);
                        // Auto-save on toggle if preferred, or just leave it for the button
                      }}
                      className="w-4 h-4" 
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Send order notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={platformSettings.sendVendorUpdates}
                      onChange={(e) => {
                        const newSettings = {...platformSettings, sendVendorUpdates: e.target.checked};
                        setPlatformSettings(newSettings);
                      }}
                      className="w-4 h-4" 
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Send vendor updates</span>
                  </label>
                  <button 
                    onClick={handleUpdateSettings}
                    className="mt-4 w-full px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                  >
                    Update Preferences
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border dark:border-border-dark shadow-card md:col-span-2">
                <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Advanced Controls</h3>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <div>
                    <h4 className="font-bold text-red-600 dark:text-red-400 text-sm">Maintenance Mode</h4>
                    <p className="text-xs text-slate-500 mt-0.5">When active, only admins can access the platform storefront.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const mode = !platformSettings.maintenanceMode;
                      setPlatformSettings({...platformSettings, maintenanceMode: mode});
                      toast(mode ? 'Maintenance mode will be enabled' : 'Maintenance mode will be disabled');
                    }}
                    className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${platformSettings.maintenanceMode ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                  >
                    {platformSettings.maintenanceMode ? 'Active' : 'Disabled'}
                  </button>
                </div>
                {platformSettings.maintenanceMode && (
                   <button 
                   onClick={handleUpdateSettings}
                   className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                 >
                   Confirm & Save Global Changes
                 </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
