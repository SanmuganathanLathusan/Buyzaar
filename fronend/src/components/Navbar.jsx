import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Sun, Moon, Menu, ChevronDown, RefreshCw, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/products?';
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (searchCategory) url += `category=${encodeURIComponent(searchCategory)}`;
    
    // Remove trailing & or ? if nothing added
    if (url.endsWith('&') || url.endsWith('?')) {
      url = url.slice(0, -1);
    }
    
    // If empty search, just go to products
    if (!url) url = '/products';
    
    navigate(url);
  };

  return (
    <nav className="w-full bg-white dark:bg-cardDark shadow-sm z-50">
      {/* Top Nav (White Background) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-3xl font-extrabold text-primary dark:text-primary-light tracking-tight">buyzaar</span>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="order-last md:order-none w-full md:w-auto md:flex-1 md:max-w-3xl px-0 md:px-8">
            <div className="flex w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Products"
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-l-md focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-white dark:bg-gray-800 border-t border-b border-l border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-500 text-sm hidden sm:block focus:outline-none cursor-pointer max-w-[150px]"
              >
                <option value="">All Categories</option>
                {['Fashion Collection', 'Electronics Item', 'Home Appliance', 'Kitchen Item', 'Furniture', 'Food', 'Gadgets', 'Toys and Games', 'Health & beauty'].map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-r-md transition-colors flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Actions - Right */}
          <div className="flex items-center space-x-5 flex-shrink-0">



            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                <Link 
                  to={user.role === 'vendor' ? '/vendor-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} 
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Account</span>
                    <span className="text-sm font-semibold truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }} 
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors hidden sm:block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                <User className="h-5 w-5" />
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-sm font-semibold">Account</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav (Blue Background) */}
      <div className="hidden md:block mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center bg-primary rounded-md">
            
            {/* Browse Categories Button */}
            <div className="relative group">
              <div 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="bg-primary-hover flex items-center gap-3 px-6 py-3.5 text-white font-medium cursor-pointer w-[250px] rounded-l-md"
              >
                <Menu className="h-5 w-5" />
                <span>Browse Categories</span>
              </div>
              
              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 w-[250px] bg-white dark:bg-cardDark shadow-lg border border-gray-100 dark:border-gray-800 rounded-b-md z-50">
                  <div className="flex flex-col py-2">
                    {['Fashion Collection', 'Electronics Item', 'Home Appliance', 'Kitchen Item', 'Furniture', 'Food', 'Gadgets', 'Toys and Games', 'Health & beauty'].map((cat, idx) => (
                      <Link 
                        key={idx}
                        to={`/products?category=${cat}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex flex-1 items-center justify-end pr-4">
              <div className="flex items-center space-x-14 text-white text-sm font-medium">
                <Link to="/" className="hover:text-primary-light transition-colors">Home</Link>
                <Link to="/products" className="hover:text-primary-light transition-colors">Products</Link>
                <Link to="/products" className="hover:text-primary-light transition-colors">Categories</Link>
                <Link to="/contact" className="hover:text-primary-light transition-colors">Contact us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
