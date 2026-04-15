import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Store, Activity, Settings, LogOut, ShieldCheck, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalOrders: 0,
    recentVendors: []
  });

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchAdminData();
  }, [token, user, navigate]);

  const fetchAdminData = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to fetch admin data');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formattedStats = [
    { title: 'Total Revenue (Platform)', value: `Rs. ${dashboardData.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/10' },
    { title: 'Registered Vendors', value: dashboardData.totalVendors.toLocaleString(), icon: Store, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
    { title: 'Active Customers', value: dashboardData.totalCustomers.toLocaleString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/10' },
    { title: 'Platform Traffic (Orders)', value: dashboardData.totalOrders.toLocaleString(), icon: Activity, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/10' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'Suspended': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark text-primary">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-current rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex flex-col md:flex-row pb-12 md:pb-0">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white md:h-screen md:sticky top-16 md:top-20 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Admin Control
          </h2>
          <p className="text-xs text-gray-400 mt-1">Platform Operations</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-gray-800 text-white rounded-md font-medium">
            <Activity size={20} /> Overview
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
            <Store size={20} /> Vendors
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
            <Users size={20} /> Customers
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
            <DollarSign size={20} /> Payouts
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
            <Settings size={20} /> Platform Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-md transition-colors font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
            <p className="text-sm text-gray-500">Global metrics and platform health.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white dark:bg-cardDark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Mail size={16} /> Send Broadcast
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {formattedStats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-cardDark p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full flex-shrink-0 ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vendor Management */}
        <div className="bg-white dark:bg-cardDark rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Vendor Registrations</h3>
            <button className="text-primary text-sm font-medium hover:underline">Manage All Vendors</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-cardDark text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 font-medium">Vendor / Shop Name</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Gross Revenue</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {dashboardData.recentVendors.length === 0 ? (
                   <tr>
                     <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-500">
                       No vendors registered yet.
                     </td>
                   </tr>
                ) : (
                  dashboardData.recentVendors.map((vendor, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{vendor.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{vendor.plan}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{vendor.joinDate}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{vendor.revenue}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm text-blue-500 hover:text-blue-700 font-medium">Review</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
