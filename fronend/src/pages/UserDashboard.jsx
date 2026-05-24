import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, X, Phone, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import toast from 'react-hot-toast';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 outline-none';

const UserDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: '',
    street: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch fresh profile with extended fields
      const profileRes = await fetchWithAuth('/api/auth/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        setEditData({
          phone: profileData.phone || '',
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          country: profileData.address?.country || ''
        });
      } else {
        const errText = await profileRes.text();
        console.error('Profile fetch failed:', profileRes.status, errText);
        toast.error('Failed to load profile');
      }

      // Fetch User Orders
      const ordersRes = await fetchWithAuth('/api/orders/myorders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        const errText = await ordersRes.text();
        console.error('Orders fetch failed:', ordersRes.status, errText);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: profile?.name,
        phone: editData.phone || '',
        address: {
          street: editData.street || '',
          city: editData.city || '',
          country: editData.country || ''
        }
      };

      const res = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setEditData({
          phone: updatedProfile.phone || '',
          street: updatedProfile.address?.street || '',
          city: updatedProfile.address?.city || '',
          country: updatedProfile.address?.country || ''
        });
        setIsEditing(false);
        toast.success('Profile updated successfully! ✓');
      } else {
        const errData = await res.json();
        console.error('Update failed:', errData);
        toast.error(errData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Could not connect to server. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-secondary dark:text-white font-medium">My Account</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark overflow-hidden shadow-card p-5">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 pb-5 mb-4 border-b border-border dark:border-border-dark">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                  {getInitials(profile?.name || user?.name)}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-bold text-secondary dark:text-white truncate">
                    {profile?.name || user?.name || 'User'}
                  </h2>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{profile?.email || user?.email}</p>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1.5">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-primary/8 text-primary rounded-xl font-bold transition-all text-left">
                  <span className="flex items-center gap-3">
                    <User size={18} /> Manage My Account
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800 rounded-xl font-semibold transition-all text-left group">
                  <span className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <Package size={18} /> My Orders
                  </span>
                  {orders.length > 0 && (
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-border dark:border-border-dark">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800 rounded-xl font-semibold transition-all text-left group">
                  <span className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <MapPin size={18} /> Address Book
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800 rounded-xl font-semibold transition-all text-left group">
                  <span className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <CreditCard size={18} /> Payment Methods
                  </span>
                </button>
              </nav>

              <div className="border-t border-border dark:border-border-dark mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30 transition-all text-sm font-bold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">Manage My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-border dark:border-border-dark shadow-card col-span-1 md:col-span-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-border dark:border-border-dark">
                    <h3 className="font-bold text-secondary dark:text-white">Personal Profile</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center">
                      <span className="font-bold text-slate-400 dark:text-slate-500 w-24 flex-shrink-0">NAME</span>
                      <span className="font-semibold text-secondary dark:text-white">
                        {profile?.name || user?.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-slate-400 dark:text-slate-500 w-24 flex-shrink-0">EMAIL</span>
                      <span className="font-semibold text-secondary dark:text-white">
                        {profile?.email || user?.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-slate-400 dark:text-slate-500 w-24 flex-shrink-0">PHONE</span>
                      <span className="font-semibold text-secondary dark:text-white">
                        {profile?.phone || <span className="text-slate-400 italic font-normal">Not provided</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Address details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-border dark:border-border-dark shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-border dark:border-border-dark">
                    <h3 className="font-bold text-secondary dark:text-white">Address Book</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">
                      Default Delivery Address
                    </p>
                    {profile?.address && Object.values(profile.address).some((v) => v) ? (
                      <div className="space-y-1 font-semibold text-secondary dark:text-white">
                        {profile.address.street && <p>{profile.address.street}</p>}
                        {profile.address.city && <p>{profile.address.city}</p>}
                        {profile.address.country && <p>{profile.address.country}</p>}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">
                        No address provided. Click edit to add your shipping address.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Orders list */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h3 className="text-lg font-bold text-secondary dark:text-white">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                      <th className="px-6 py-4">Order #</th>
                      <th className="px-6 py-4">Placed On</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-400">
                          You haven't placed any orders yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => (
                        <tr
                          key={order._id || i}
                          className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-primary">
                            #{order._id?.substring(order._id.length - 6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                            {order.orderItems?.reduce((acc, item) => acc + item.qty, 0) || 0}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">
                            Rs. {order.totalPrice?.toLocaleString() || 0}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
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
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center bg-white dark:bg-surface-dark">
                <h2 className="text-xl font-black text-secondary dark:text-white">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-slate-400 hover:text-primary rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className={inputCls}
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <h3 className="font-bold text-sm text-secondary dark:text-white pt-4 border-t border-border dark:border-border-dark uppercase tracking-wider">
                  Delivery Address
                </h3>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={editData.street}
                    onChange={(e) => setEditData({ ...editData, street: e.target.value })}
                    className={inputCls}
                    placeholder="123 Shopping Avenue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      City
                    </label>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className={inputCls}
                      placeholder="Colombo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editData.country}
                      onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                      className={inputCls}
                      placeholder="Sri Lanka"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-3 justify-end border-t border-border dark:border-border-dark">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary btn-md rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-md rounded-2xl px-6"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
