import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, Users, Settings, LogOut, TrendingUp, AlertCircle, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth, API_BASE } from '../utils/api';
import toast from 'react-hot-toast';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 outline-none';

const VendorDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', originalPrice: '', discount: '', category: 'Mobiles', image: '', images: ['', '', ''], stock: ''
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
      const prodRes = await fetchWithAuth('/api/products/vendor/myproducts');
      if (!prodRes.ok) {
        const err = await prodRes.json();
        console.error('Products fetch error:', err.message);
        setProducts([]);
      } else {
        const prodData = await prodRes.json();
        setProducts(Array.isArray(prodData) ? prodData : []);
      }

      const orderRes = await fetchWithAuth('/api/orders/vendor');
      if (!orderRes.ok) {
        const err = await orderRes.json();
        console.error('Orders fetch error:', err.message);
        setOrders([]);
      } else {
        const orderData = await orderRes.json();
        setOrders(Array.isArray(orderData) ? orderData : []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((o) => o.customer?._id)).size;

  let totalRevenue = 0;
  orders.forEach((order) => {
    if (order.status !== 'Cancelled') {
      order.orderItems.forEach((item) => {
        if (item.product && item.product.vendor && item.product.vendor.toString() === user?._id?.toString()) {
          totalRevenue += item.price * item.qty;
        }
      });
    }
  });

  const stats = [
    { title: 'Total Revenue', value: `Rs. ${(totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/20' },
    { title: 'Total Orders', value: String(totalOrders ?? 0), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/20' },
    { title: 'Total Products', value: String(totalProducts ?? 0), icon: Package, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/20' },
    { title: 'Store Visitors', value: String(uniqueCustomers ?? 0), icon: Users, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/20' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || 0,
        discount: Number(newProduct.discount) || 0,
        stock: Number(newProduct.stock),
        images: newProduct.images.filter(img => img.trim() !== ''),
        image: newProduct.images[0] || newProduct.image 
      };

      const res = await fetchWithAuth('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewProduct({ title: '', description: '', price: '', originalPrice: '', discount: '', category: 'Mobiles', image: '', images: ['', '', ''], stock: '' });
        toast.success('Product created successfully!');
        fetchDashboardData();
      } else {
        const errData = await res.json();
        toast.error(`Error: ${errData.message}`);
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to connect to server');
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('images', file);

    const toastId = toast.loading('Uploading image...');
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // data.urls[0] is now a full Cloudinary URL
        const uploadedUrl = data.urls[0];
        
        const updatedImages = [...newProduct.images];
        updatedImages[index] = uploadedUrl;
        setNewProduct({ ...newProduct, images: updatedImages });
        
        toast.success('Image uploaded successfully', { id: toastId });
      } else {
        toast.error('Upload failed', { id: toastId });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Connect error during upload', { id: toastId });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetchWithAuth(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Product deleted successfully!");
        fetchDashboardData();
      } else {
        const errData = await res.json();
        toast.error(`Error: ${errData.message}`);
      }
    } catch(err) {
      toast.error('Failed to delete product');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customersMap = new Map();
  orders.forEach(order => {
    if(order.customer && order.customer._id) {
      const spent = order.orderItems.filter(i => i.product?.vendor === user?._id).reduce((sum, item) => sum + item.price * item.qty, 0);
      if(!customersMap.has(order.customer._id)) {
        customersMap.set(order.customer._id, {
          ...order.customer,
          orderCount: 1,
          totalSpent: spent
        });
      } else {
        const c = customersMap.get(order.customer._id);
        c.orderCount += 1;
        c.totalSpent += spent;
      }
    }
  });
  const uniqueCustomersList = Array.from(customersMap.values());

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col md:flex-row pb-12 md:pb-0">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-surface-dark border-b md:border-b-0 md:border-r border-border dark:border-border-dark md:h-screen md:sticky md:top-16 flex flex-col pt-2 md:pt-0">
        <div className="p-4 md:p-6 hidden md:block">
          <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight">Vendor Portal</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.businessName || user?.name || 'Vendor Store'}</p>
        </div>

        <nav className="flex-none flex overflow-x-auto md:flex-1 md:flex-col px-2 md:px-4 py-2 md:py-0 md:space-y-1.5 gap-1.5 scrollbar-none">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold text-sm md:text-base text-left transition-colors ${activeTab === 'dashboard' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}>
            <TrendingUp size={18} className="md:w-5 md:h-5" /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold text-sm md:text-base text-left transition-colors ${activeTab === 'products' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}>
            <Package size={18} className="md:w-5 md:h-5" /> <span>Products</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold text-sm md:text-base text-left transition-colors flex justify-between items-center w-full ${activeTab === 'orders' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}>
            <span className="flex items-center gap-2 md:gap-3"><ShoppingBag size={18} className="md:w-5 md:h-5" /> <span>Orders</span></span>
            {orders.length > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${activeTab === 'orders' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border dark:border-border-dark'}`}>
                {orders.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('customers')} className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold text-sm md:text-base text-left transition-colors ${activeTab === 'customers' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}>
            <Users size={18} className="md:w-5 md:h-5" /> <span>Customers</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold text-sm md:text-base text-left transition-colors ${activeTab === 'settings' ? 'bg-primary/8 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'}`}>
            <Settings size={18} className="md:w-5 md:h-5" /> <span>Settings</span>
          </button>

          <button onClick={handleLogout} className="md:hidden flex-shrink-0 flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-sm">
            <LogOut size={18} /> Logout
          </button>
        </nav>

        <div className="p-4 border-t border-border dark:border-border-dark hidden md:block mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30 transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'products' && 'My Products'}
              {activeTab === 'orders' && 'Manage Orders'}
              {activeTab === 'customers' && 'My Customers'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
            <p className="text-sm text-slate-500">Welcome back, {user?.name || 'Vendor'}</p>
          </div>
          {(activeTab === 'dashboard' || activeTab === 'products') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary btn-md rounded-xl gap-2 font-bold"
            >
              <Plus size={16} /> Add Product
            </button>
          )}
        </header>

        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Loading store details…</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
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
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
                  <h3 className="text-lg font-bold text-secondary dark:text-white">Recent Orders</h3>
                  <button className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border-dark">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">
                            No recent orders.
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((order, i) => (
                          <tr key={order._id || i} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-primary">
                              #{order._id?.substring(order._id.length - 6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                              {order.customer?.name || 'Guest'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">
                              Rs.{' '}
                              {order.orderItems
                                .filter((item) => item.product?.vendor === user?._id)
                                .reduce((sum, item) => sum + item.price * item.qty, 0)
                                .toLocaleString()}
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

              {/* Quick Actions / Alerts */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card p-6">
                  <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Stock Alerts</h3>
                  <div className="space-y-4">
                    {products.filter((p) => p.stock < 5).length === 0 ? (
                      <p className="text-sm text-slate-400 italic">All products have sufficient stock.</p>
                    ) : (
                      products
                        .filter((p) => p.stock < 5)
                        .map((prod) => (
                          <div key={prod._id} className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${prod.stock === 0 ? 'bg-red-50 dark:bg-red-950/30 text-red-500' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-500'}`}>
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-secondary dark:text-white leading-snug">
                                {prod.stock === 0 ? 'Out of Stock' : 'Low Stock'}: {prod.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1">Only {prod.stock} items left in inventory.</p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/20 rounded-3xl p-6 border border-primary/20 text-center">
                  <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">Boost Your Sales</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                    Join our upcoming Mega Sale campaign to increase visibility and traffic!
                  </p>
                  <button className="btn-primary btn-md w-full rounded-xl justify-center font-bold">
                    Join Campaign
                  </button>
                </div>
              </div>
            </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border-dark">
                      {products.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">No products found.</td></tr>
                      ) : (
                        products.map(prod => (
                          <tr key={prod._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <img src={prod.image} alt={prod.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                              <span className="text-sm font-semibold text-secondary dark:text-white truncate max-w-[200px]">{prod.title}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{prod.category}</td>
                            <td className="px-6 py-4 text-sm font-bold text-primary">Rs. {prod.price.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-lg ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {prod.stock} in stock
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteProduct(prod._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border-dark">
                      {orders.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">No orders found.</td></tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-primary">#{order._id?.substring(order._id.length - 6).toUpperCase()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{order.customer?.name || 'Guest'}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">
                              Rs. {order.orderItems.filter(i => i.product?.vendor === user?._id).reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}
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

            {activeTab === 'customers' && (
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-muted dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border dark:border-border-dark">
                        <th className="px-6 py-4">Customer Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Orders</th>
                        <th className="px-6 py-4">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border-dark">
                      {uniqueCustomersList.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-400">No customers found.</td></tr>
                      ) : (
                        uniqueCustomersList.map(c => (
                          <tr key={c._id} className="hover:bg-surface-muted/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-secondary dark:text-white">{c.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{c.email}</td>
                            <td className="px-6 py-4 text-sm font-semibold">{c.orderCount}</td>
                            <td className="px-6 py-4 text-sm font-bold text-primary">Rs. {c.totalSpent.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card p-6 md:p-8">
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-6">Change Password</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const password = e.target.password.value;
                    const confirmPassword = e.target.confirmPassword.value;
                    if (password !== confirmPassword) {
                      return toast.error("Passwords do not match");
                    }
                    if (password.length < 6) {
                      return toast.error("Password must be at least 6 characters");
                    }
                    try {
                      const res = await fetchWithAuth('/api/auth/profile', {
                        method: 'PUT',
                        body: JSON.stringify({ password })
                      });
                      if (res.ok) {
                        toast.success("Password updated successfully!");
                        e.target.reset();
                      } else {
                        const err = await res.json();
                        toast.error(err.message || "Failed to update password");
                      }
                    } catch (error) {
                      toast.error("Failed to connect to server");
                    }
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      New Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      className={inputCls}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Confirm New Password
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className={inputCls}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full py-3 rounded-xl font-bold">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-surface-dark p-6 border-b border-border dark:border-border-dark flex justify-between items-center z-10">
                <h2 className="text-xl font-black text-secondary dark:text-white">Add New Product</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-primary rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. Samsung Galaxy S23 Ultra"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className={`${inputCls} resize-none`}
                      placeholder="Enter product description..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Selling Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className={inputCls}
                      placeholder="99999"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Original Price (Rs.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      className={inputCls}
                      placeholder="120000"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="appearance-none w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 outline-none cursor-pointer"
                      >
                        <option value="Fashion Collection">Fashion Collection</option>
                        <option value="Electronics Item">Electronics Item</option>
                        <option value="Home Appliance">Home Appliance</option>
                        <option value="Kitchen Item">Kitchen Item</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Food">Food</option>
                        <option value="Gadgets">Gadgets</option>
                        <option value="Toys and Games">Toys and Games</option>
                        <option value="Health & beauty">Health & beauty</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className={inputCls}
                      placeholder="50"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Product Images (Up to 3) *
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      {[0, 1, 2].map((idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              required={idx === 0}
                              value={newProduct.images[idx]}
                              onChange={(e) => {
                                const updatedImages = [...newProduct.images];
                                updatedImages[idx] = e.target.value;
                                setNewProduct({ ...newProduct, images: updatedImages });
                              }}
                              className={`${inputCls} flex-1`}
                              placeholder={`Image URL ${idx + 1}${idx === 0 ? ' (Main)' : ''}`}
                            />
                            <label className="flex-shrink-0 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-3 rounded-xl border border-primary/20 transition-colors text-sm font-bold">
                              <span>Upload</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, idx)} 
                              />
                            </label>
                          </div>
                          {newProduct.images[idx] && (
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border dark:border-border-dark group">
                              <img src={newProduct.images[idx]} className="w-full h-full object-cover" alt="Preview" />
                              <button 
                                type="button"
                                onClick={() => {
                                  const updatedImages = [...newProduct.images];
                                  updatedImages[idx] = '';
                                  setNewProduct({ ...newProduct, images: updatedImages });
                                }}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} className="text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-3 justify-end border-t border-border dark:border-border-dark">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary btn-md rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-md rounded-2xl px-6"
                  >
                    Create Product
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

export default VendorDashboard;
