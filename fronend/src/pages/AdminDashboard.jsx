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
      case 'Pending Review':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
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
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading admin control panel…</p>
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
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold">
            <Activity size={18} /> Overview
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-xl font-semibold transition-colors">
            <Store size={18} /> Vendors
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-xl font-semibold transition-colors">
            <Users size={18} /> Customers
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-xl font-semibold transition-colors">
            <DollarSign size={18} /> Payouts
          </button>
          <button className="w-full flex items-center justify-start gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-xl font-semibold transition-colors">
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
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Admin Overview</h1>
            <p className="text-sm text-slate-500">Global metrics and platform health.</p>
          </div>
          <button className="btn-secondary btn-md rounded-xl gap-2 font-bold bg-white dark:bg-slate-800 border border-border dark:border-border-dark shadow-card">
            <Mail size={16} /> Send Broadcast
          </button>
        </header>

        {/* Stats Grid */}
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
                  <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight truncate max-w-[150px]">
                    {stat.value}
                  </h3>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vendor Management */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
          <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
            <h3 className="text-lg font-bold text-secondary dark:text-white">Recent Vendor Registrations</h3>
            <button className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors">
              Manage All Vendors
            </button>
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
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-400">
                      No vendors registered yet.
                    </td>
                  </tr>
                ) : (
                  dashboardData.recentVendors.map((vendor, i) => (
                    <tr key={i} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{vendor.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{vendor.plan}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{vendor.joinDate}</td>
                      <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{vendor.revenue}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(vendor.status)}`}>
                          {vendor.status}
                        </span>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
