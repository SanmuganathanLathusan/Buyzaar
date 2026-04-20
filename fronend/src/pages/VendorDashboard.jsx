import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, Users, Settings, LogOut, TrendingUp, AlertCircle, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';

const VendorDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', originalPrice: '', discount: '', category: 'Mobiles', image: '', stock: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetchWithAuth('http://localhost:5000/api/products/vendor/myproducts');
      const prodData = await prodRes.json();
      setProducts(prodData || []);

      const orderRes = await fetchWithAuth('http://localhost:5000/api/orders/vendor');
      const orderData = await orderRes.json();
      setOrders(orderData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customer?._id)).size;

  let totalRevenue = 0;
  orders.forEach(order => {
    if (order.status !== 'Cancelled') {
      order.orderItems.forEach(item => {
        if (item.product && item.product.vendor && item.product.vendor.toString() === user?._id?.toString()) {
           totalRevenue += item.price * item.qty;
        }
      });
    }
  });

  const stats = [
    { title: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/10' },
    { title: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
    { title: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/10' },
    { title: 'Store Visitors', value: uniqueCustomers.toString(), icon: Users, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/10' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
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
         stock: Number(newProduct.stock)
      };

      const res = await fetchWithAuth('http://localhost:5000/api/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setNewProduct({ title: '', description: '', price: '', originalPrice: '', discount: '', category: 'Mobiles', image: '', stock: '' });
        fetchDashboardData();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (error) {
       console.error('Failed to create product:', error);
       alert('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex flex-col md:flex-row pb-12 md:pb-0">
      {/* Sidebar / Top Nav on Mobile */}
      <aside className="w-full md:w-64 bg-white dark:bg-cardDark border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 md:h-screen md:sticky md:top-16 lg:top-20 flex flex-col pt-2 md:pt-0">
        <div className="p-4 md:p-6 hidden md:block">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vendor Portal</h2>
          <p className="text-xs text-gray-500 mt-1">{user?.businessName || user?.name || 'Vendor Store'}</p>
        </div>
        
        <nav className="flex-none flex overflow-x-auto md:flex-1 md:flex-col px-2 md:px-4 py-2 md:py-0 md:space-y-2 gap-2 scrollbar-none">
          <button className="flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 bg-primary/10 text-primary rounded-md font-medium text-sm md:text-base">
            <TrendingUp size={18} className="md:w-5 md:h-5" /> <span className="whitespace-nowrap">Dashboard</span>
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-sm md:text-base">
            <Package size={18} className="md:w-5 md:h-5" /> <span className="whitespace-nowrap">Products</span>
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-sm md:text-base">
            <ShoppingBag size={18} className="md:w-5 md:h-5" /> <span className="whitespace-nowrap">Orders</span>
            {orders.length > 0 && (
              <span className="ml-1 md:ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
            )}
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-sm md:text-base">
            <Users size={18} className="md:w-5 md:h-5" /> <span className="whitespace-nowrap">Customers</span>
          </button>
          
          {/* Mobile Logout Button (shows inline with tabs) */}
          <button onClick={handleLogout} className="md:hidden flex-shrink-0 flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors text-sm">
            <LogOut size={18} /> Logout
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 hidden md:block">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
            <LogOut size={20} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Vendor'}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </button>
        </header>

        {loading ? (
           <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
         </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
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
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white dark:bg-cardDark rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                  <button className="text-primary text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Order ID</th>
                        <th className="px-6 py-4 font-medium">Customer</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Total</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No recent orders.</td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((order, i) => (
                          <tr key={order._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{order._id?.substring(order._id.length - 6).toUpperCase()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.customer?.name || 'Guest'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                              Rs. {order.orderItems
                                .filter(item => item.product?.vendor === user?._id)
                                .reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}
                            </td>
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

              {/* Quick Actions / Alerts */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-cardDark rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Stock Alerts</h3>
                  <div className="space-y-4">
                    {products.filter(p => p.stock < 5).length === 0 ? (
                      <p className="text-sm text-gray-500">All products have sufficient stock.</p>
                    ) : (
                      products.filter(p => p.stock < 5).map((prod) => (
                        <div key={prod._id} className="flex items-start gap-3">
                          <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${prod.stock === 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{prod.stock === 0 ? 'Out of Stock' : 'Low Stock'}: {prod.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">Only {prod.stock} items left in inventory.</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/20 rounded-lg p-6 border border-primary/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Boost Your Sales</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Join our upcoming Mega Sale campaign to increase visibility!</p>
                  <button className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md text-sm font-medium transition-colors">
                    Join Campaign
                  </button>
                </div>
              </div>
            </div>
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
              className="bg-white dark:bg-cardDark rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-cardDark p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Product</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title *</label>
                      <input 
                        type="text" 
                        required
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="e.g. Samsung Galaxy S23 Ultra"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea 
                        rows="3"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                        placeholder="Enter product description..."
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (Rs.) *</label>
                    <input 
                      type="number" 
                      required min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="99999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price (Rs.)</label>
                    <input 
                      type="number" min="0"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="120000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                    <select 
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option value="Mobiles">Mobiles</option>
                      <option value="Laptops">Laptops</option>
                      <option value="TVs">TVs</option>
                      <option value="Audio">Audio</option>
                      <option value="Watches">Watches</option>
                      <option value="Cameras">Cameras</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity *</label>
                    <input 
                      type="number" 
                      required min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL *</label>
                    <input 
                      type="url" 
                      required
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4 justify-end border-t border-gray-100 dark:border-gray-800">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-md text-sm font-medium transition-colors"
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
