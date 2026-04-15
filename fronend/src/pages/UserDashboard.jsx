import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import toast from 'react-hot-toast';

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
      const profileRes = await fetchWithAuth('http://localhost:5000/api/auth/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        setEditData({
          phone: profileData.phone || '',
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          country: profileData.address?.country || ''
        });
      }

      // Fetch User Orders
      const ordersRes = await fetchWithAuth('http://localhost:5000/api/orders/myorders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        phone: editData.phone,
        address: {
          street: editData.street,
          city: editData.city,
          country: editData.country
        }
      };

      const res = await fetchWithAuth('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Could not connect to server');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'Processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link> 
          <ChevronRight size={14} /> 
          <span className="text-gray-900 dark:text-white font-medium">My Account</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-cardDark rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                  {getInitials(profile?.name || user?.name)}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-bold text-gray-900 dark:text-white truncate">{profile?.name || user?.name || 'User'}</h2>
                  <p className="text-xs text-gray-500 truncate">{profile?.email || user?.email}</p>
                </div>
              </div>
              
              <nav className="p-2 space-y-1">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 text-primary rounded-md font-medium transition-colors">
                  <span className="flex items-center gap-3"><User size={18} /> Manage My Account</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <span className="flex items-center gap-3"><Package size={18} /> My Orders</span>
                  {orders.length > 0 && (
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{orders.length}</span>
                  )}
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <span className="flex items-center gap-3"><MapPin size={18} /> Address Book</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <span className="flex items-center gap-3"><CreditCard size={18} /> Payment Methods</span>
                </button>
              </nav>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded border border-red-100 dark:border-red-900/30 transition-colors text-sm font-medium">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage My Account</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-cardDark p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Personal Profile</h3>
                  <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-primary hover:underline">Edit</button>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium text-gray-800 dark:text-gray-200 w-16 inline-block">Name:</span> {profile?.name || user?.name}</p>
                  <p><span className="font-medium text-gray-800 dark:text-gray-200 w-16 inline-block">Email:</span> {profile?.email || user?.email}</p>
                  <p><span className="font-medium text-gray-800 dark:text-gray-200 w-16 inline-block">Phone:</span> {profile?.phone ? profile.phone : <span className="text-gray-400 italic">Not provided</span>}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-cardDark p-6 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Address Book</h3>
                  <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-primary hover:underline">Edit</button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Default Delivery Address</p>
                  {profile?.address && Object.values(profile.address).some(v => v) ? (
                    <div className="space-y-1">
                      {profile.address.street && <p>{profile.address.street}</p>}
                      {profile.address.city && <p>{profile.address.city}</p>}
                      {profile.address.country && <p>{profile.address.country}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No address provided. Click edit to add your shipping address.</p>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="bg-white dark:bg-cardDark rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Order #</th>
                      <th className="px-6 py-4 font-medium">Placed On</th>
                      <th className="px-6 py-4 font-medium">Items</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                          You haven't placed any orders yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => (
                        <tr key={order._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary cursor-pointer">#{order._id?.substring(order._id.length - 6).toUpperCase()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.orderItems?.reduce((acc, item) => acc + item.qty, 0) || 0}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Rs. {order.totalPrice?.toLocaleString() || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
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
              className="bg-white dark:bg-cardDark rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-white dark:bg-cardDark p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-gray-800">Delivery Address</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input 
                    type="text" 
                    value={editData.street}
                    onChange={(e) => setEditData({...editData, street: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="123 Shopping Avenue"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input 
                      type="text" 
                      value={editData.city}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                    <input 
                      type="text" 
                      value={editData.country}
                      onChange={(e) => setEditData({...editData, country: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-md text-sm font-medium transition-colors"
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
