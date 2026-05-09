import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, ChevronDown, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/products', label: 'Categories' },
  { to: '/contact', label: 'Contact' },
];

const CATEGORY_LINKS = [
  'Fashion Collection',
  'Electronics Item',
  'Home Appliance',
  'Kitchen Item',
  'Furniture',
  'Food',
  'Gadgets',
  'Toys and Games',
  'Health & beauty',
];

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/products?';
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery)}&`;
    
    // Remove trailing & or ? if nothing added
    if (url.endsWith('&') || url.endsWith('?')) {
      url = url.slice(0, -1);
    }
    
    // If empty search, just go to products
    if (!url) url = '/products';
    
    navigate(url);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4 py-4 lg:flex-nowrap">
          <Link to="/" className="group flex items-center gap-3 rounded-2xl bg-slate-950 px-4 py-2 text-white shadow-lg shadow-slate-950/15 transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 dark:bg-slate-950/10">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xs uppercase tracking-[0.3em] text-white/65 dark:text-slate-500">Multi-vendor</span>
              <span className="text-2xl font-black tracking-tight">Buyzaar</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="order-3 w-full lg:order-none lg:flex-1 lg:px-6">
            <div className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all focus-within:border-primary focus-within:bg-white focus-within:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:focus-within:bg-slate-950">
              <div className="flex items-center pl-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, and more"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              <button type="submit" className="bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:flex"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </button>

            <Link to="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white px-3 pr-4 text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="hidden max-w-[110px] flex-col text-left sm:flex">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Account</span>
                    <span className="truncate text-sm font-semibold">{user.email.split('@')[0]}</span>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                    <div className="px-3 py-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quick links</div>
                    </div>
                    <Link
                      to={user.role === 'vendor' ? '/vendor-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <User className="h-4 w-4 text-primary" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsCategoriesOpen(false);
                      }}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <User className="h-4 w-4" />
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 lg:hidden"
            >
              <Menu className="h-4 w-4" />
              Menu
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-3 pb-4 lg:flex">
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Menu className="h-4 w-4" />
            Browse Categories
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {isCategoriesOpen && (
          <div className="mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {CATEGORY_LINKS.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setIsCategoriesOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
    </nav>
  );
};

export default Navbar;
