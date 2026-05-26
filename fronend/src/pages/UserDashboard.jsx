import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, X, Phone, Settings, Trash2, Plus, ShieldCheck } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState('profile');

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: '',
    street: '',
    city: '',
    country: '',
    profilePhoto: ''
  });

  // Payment States
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardHolderName: '',
    cardType: 'Visa',
    cardNumber: '',
    expMonth: '01',
    expYear: '2025'
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
          country: profileData.address?.country || '',
          profilePhoto: profileData.profilePhoto || ''
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: profile?.name,
        phone: editData.phone || '',
        profilePhoto: editData.profilePhoto || '',
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
          country: updatedProfile.address?.country || '',
          profilePhoto: updatedProfile.profilePhoto || ''
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

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    if (newCard.cardNumber.length < 16) return toast.error('Check card number');
    
    try {
      const payload = {
        cardType: newCard.cardType,
        cardHolderName: newCard.cardHolderName,
        last4: newCard.cardNumber.slice(-4),
        expMonth: parseInt(newCard.expMonth),
        expYear: parseInt(newCard.expYear),
        isDefault: profile?.paymentMethods?.length === 0
      };

      const res = await fetchWithAuth('/api/auth/payment-methods', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedMethods = await res.json();
        setProfile({ ...profile, paymentMethods: updatedMethods });
        setIsAddingCard(false);
        setNewCard({ cardHolderName: '', cardType: 'Visa', cardNumber: '', expMonth: '01', expYear: '2025' });
        toast.success('Card added successfully! 💳');
      } else {
        toast.error('Failed to add card');
      }
    } catch (error) {
      toast.error('Error adding payment method');
    }
  };

  const handleDeletePaymentMethod = async (cardId) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      const res = await fetchWithAuth(`/api/auth/payment-methods/${cardId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updatedMethods = await res.json();
        setProfile({ ...profile, paymentMethods: updatedMethods });
        toast.success('Card removed');
      }
    } catch (error) {
      toast.error('Could not delete card');
    }
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
                {profile?.profilePhoto || user?.profilePhoto ? (
                  <img 
                    src={profile?.profilePhoto || user?.profilePhoto} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-2xl object-cover shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {getInitials(profile?.name || user?.name)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h2 className="font-bold text-secondary dark:text-white truncate">
                    {profile?.name || user?.name || 'User'}
                  </h2>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{profile?.email || user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1.5">
                <button 
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all text-left ${activeSection === 'profile' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}
                >
                  <span className="flex items-center gap-3">
                    <User size={18} /> Manage My Account
                  </span>
                </button>
                <button 
                  onClick={() => setActiveSection('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all text-left group ${activeSection === 'orders' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}
                >
                  <span className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <Package size={18} /> My Orders
                  </span>
                  {orders.length > 0 && (
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${activeSection === 'orders' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border dark:border-border-dark'}`}>
                      {orders.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveSection('address')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all text-left group ${activeSection === 'address' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}
                >
                  <span className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <MapPin size={18} /> Address Book
                  </span>
                </button>
                <button 
                  onClick={() => setActiveSection('payment')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all text-left group ${activeSection === 'payment' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}
                >
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
            <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight uppercase">
              {activeSection === 'profile' && 'Manage My Account'}
              {activeSection === 'orders' && 'My Orders'}
              {activeSection === 'address' && 'Address Book'}
              {activeSection === 'payment' && 'Payment Methods'}
            </h1>

            {activeSection === 'profile' && (
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
                     <h3 className="font-bold text-secondary dark:text-white">Default Address</h3>
                     <button
                       onClick={() => setIsEditing(true)}
                       className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                     >
                       Edit
                     </button>
                   </div>
                   <div className="text-sm">
                     {profile?.address && Object.values(profile.address).some((v) => v) ? (
                       <div className="space-y-1 font-semibold text-secondary dark:text-white">
                         {profile.address.street && <p>{profile.address.street}</p>}
                         {profile.address.city && <p>{profile.address.city}</p>}
                         {profile.address.country && <p>{profile.address.country}</p>}
                       </div>
                     ) : (
                       <p className="text-slate-400 italic">
                         No address provided.
                       </p>
                     )}
                   </div>
                 </div>
               </motion.div>
             </div>
            )}

            {(activeSection === 'profile' || activeSection === 'orders') && (
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
                  <h3 className="text-lg font-bold text-secondary dark:text-white">
                    {activeSection === 'profile' ? 'Recent Orders' : 'Order History'}
                  </h3>
                  {activeSection === 'profile' && orders.length > 5 && (
                    <button onClick={() => setActiveSection('orders')} className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors">
                      View All
                    </button>
                  )}
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
                        (activeSection === 'profile' ? orders.slice(0, 5) : orders).map((order, i) => (
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
            )}

            {activeSection === 'address' && (
              <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-border dark:border-border-dark shadow-card text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">My Delivery Addresses</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Manage your shipping addresses for faster checkout and accurate delivery.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                   {profile?.address && Object.values(profile.address).some(v => v) ? (
                     <div className="p-5 rounded-2xl border-2 border-primary bg-primary/5 relative">
                        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase bg-primary text-white px-2 py-0.5 rounded-full">Default</span>
                        <h4 className="font-bold text-secondary dark:text-white mb-2">{profile.name}</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <p>{profile.address.street}</p>
                          <p>{profile.address.city}</p>
                          <p>{profile.address.country}</p>
                          <p className="pt-2 font-bold">{profile.phone}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="mt-4 text-xs font-bold text-primary hover:underline">Edit Address</button>
                     </div>
                   ) : (
                     <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center py-10">
                        <p className="text-sm text-slate-400 mb-4">No addresses saved yet.</p>
                        <button onClick={() => setIsEditing(true)} className="btn-primary btn-sm rounded-xl">Add New Address</button>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeSection === 'payment' && (
              <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-border dark:border-border-dark shadow-card">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                      <CreditCard className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary dark:text-white">Payment Methods</h3>
                      <p className="text-xs text-slate-500 font-medium">Securely management your saved cards</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAddingCard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
                  >
                    <Plus size={16} /> Add Card
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {profile?.paymentMethods && profile.paymentMethods.length > 0 ? (
                      profile.paymentMethods.map((card) => (
                        <div key={card._id} className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative group overflow-hidden shadow-card-xl">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <CreditCard size={80} />
                           </div>
                           <div className="flex justify-between items-start mb-6">
                              <span className="text-xs font-black tracking-widest uppercase opacity-60">Buyzaar Pay</span>
                              <button 
                                onClick={() => handleDeletePaymentMethod(card._id)}
                                className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                           <div className="space-y-4 relative z-10">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-7 bg-white/10 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center font-bold text-[10px]">
                                    {card.cardType}
                                 </div>
                                 <p className="text-lg font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
                              </div>
                              <div className="flex justify-between items-end">
                                 <div>
                                    <p className="text-[10px] uppercase opacity-50 font-bold mb-0.5">Card Holder</p>
                                    <p className="text-sm font-bold uppercase truncate max-w-[150px]">{card.cardHolderName}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] uppercase opacity-50 font-bold mb-0.5">Expires</p>
                                    <p className="text-sm font-bold">{String(card.expMonth).padStart(2,'0')}/{card.expYear.toString().slice(-2)}</p>
                                 </div>
                              </div>
                           </div>
                           {card.isDefault && (
                             <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400">
                                <ShieldCheck size={12} /> Default Payment Method
                             </div>
                           )}
                        </div>
                      ))
                   ) : (
                      <div className="col-span-full p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <CreditCard size={32} />
                         </div>
                         <p className="text-sm text-slate-400 font-medium">No saved cards found.</p>
                         <button onClick={() => setIsAddingCard(true)} className="mt-4 text-primary font-bold hover:underline">Click here to add your first card</button>
                      </div>
                   )}
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <ShieldCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed text-left">
                    Your payment details are encrypted and securely stored. We never share your full card information with vendors or third parties.
                  </p>
                </div>
              </div>
            )}
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
                <div className="flex flex-col items-center mb-6 space-y-3">
                  <div className="relative group cursor-pointer">
                    {editData.profilePhoto || profile?.profilePhoto || user?.profilePhoto ? (
                      <img 
                        src={editData.profilePhoto || profile?.profilePhoto || user?.profilePhoto} 
                        alt="Profile Preview" 
                        className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-surface-dark"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white dark:border-surface-dark">
                        {getInitials(profile?.name || user?.name)}
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold font-mono">
                      Change Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <span className="text-xs text-slate-400">Max size 2MB</span>
                </div>

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

      {/* Add Payment Modal */}
        <AnimatePresence>
          {isAddingCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-surface-dark rounded-[32px] border border-border dark:border-border-dark shadow-card-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center bg-white dark:bg-surface-dark relative">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CreditCard size={18} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-secondary dark:text-white">Add New Card</h2>
                  </div>
                  <button
                    onClick={() => setIsAddingCard(false)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddPaymentMethod} className="p-8 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardholder Name</label>
                    <input 
                      type="text" required value={newCard.cardHolderName}
                      onChange={e => setNewCard({...newCard, cardHolderName: e.target.value})}
                      className={inputCls} placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Type</label>
                      <select 
                        className={inputCls} value={newCard.cardType}
                        onChange={e => setNewCard({...newCard, cardType: e.target.value})}
                      >
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>Amex</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Number</label>
                      <input 
                        type="text" maxLength={16} required value={newCard.cardNumber}
                        onChange={e => setNewCard({...newCard, cardNumber: e.target.value.replace(/\D/g,'')})}
                        className={inputCls} placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Month</label>
                      <select 
                        className={inputCls} value={newCard.expMonth}
                        onChange={e => setNewCard({...newCard, expMonth: e.target.value})}
                      >
                        {Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')).map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Year</label>
                      <select 
                        className={inputCls} value={newCard.expYear}
                        onChange={e => setNewCard({...newCard, expYear: e.target.value})}
                      >
                        {Array.from({length:10},(_,i)=>2025+i).map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/25 mt-4">
                    Save Securely
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
