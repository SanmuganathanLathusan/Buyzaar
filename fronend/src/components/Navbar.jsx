import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white dark:bg-cardDark shadow-sm dark:shadow-none dark:border-b dark:border-gray-800 fixed w-full top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-2xl font-bold text-primary">
            <ShoppingCart className="h-8 w-8 text-primary" strokeWidth={2.5} />
            <span className="hidden sm:block">Buyzaar</span>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in Buyzaar"
                className="w-full bg-gray-100 dark:bg-gray-800/80 dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500 shadow-inner"
              />
              <div className="absolute left-3 top-2.5 text-gray-500">
                <Search className="h-5 w-5" />
              </div>
              <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-full font-medium hover:bg-primary-hover transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Actions - Right */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              {darkMode ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6" />}
            </button>
            
            <Link to="/cart" className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 border-l pl-4 dark:border-gray-700">
                <Link 
                  to={user.role === 'vendor' ? '/vendor-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} 
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden md:block truncate max-w-[150px]">{user.email}</span>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }} 
                  className="px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors hidden sm:block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors font-medium ml-2 border-l pl-4 dark:border-gray-700">
                <User className="h-5 w-5" />
                <span className="hidden sm:block">Login</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
