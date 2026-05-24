import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown,
  Zap, LayoutGrid, LogOut, LayoutDashboard, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/contact',  label: 'Contact' },
];

const CATEGORY_LINKS = [
  { name: 'Fashion',        emoji: '👗', sub: 'Fashion Collection & Beauty' },
  { name: 'Electronics',    emoji: '💻', sub: 'Electronics & Gadgets' },
  { name: 'Home & Living',  emoji: '🏠', sub: 'Appliances, Kitchen & Furniture' },
  { name: 'Food & Grocery', emoji: '🍔', sub: 'Fresh & packaged foods' },
  { name: 'Toys & Games',   emoji: '🎮', sub: 'Kids toys & board games' },
];

const Navbar = () => {
  const [searchQuery, setSearchQuery]         = useState('');
  const [isMenuOpen, setIsMenuOpen]           = useState(false);
  const [isCatOpen, setIsCatOpen]             = useState(false);
  const [isUserOpen, setIsUserOpen]           = useState(false);
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileSearchOpen, setMobileSearch] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartCount }   = useCart();
  const { user, logout } = useAuth();
  const catRef  = useRef(null);
  const userRef = useRef(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current  && !catRef.current.contains(e.target))  setIsCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── close mobile menu on route change ── */
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCatOpen(false);
    setIsUserOpen(false);
    setMobileSearch(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
    setMobileSearch(false);
  };

  const dashboardPath =
    user?.role === 'vendor' ? '/vendor-dashboard' :
    user?.role === 'admin'  ? '/admin-dashboard'  : '/user-dashboard';

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-card-md border-b border-border dark:border-border-dark'
          : 'bg-white dark:bg-slate-950 border-b border-border dark:border-border-dark'
      }`}>

        {/* ── Top announcement bar ── */}
        <div className="bg-gradient-to-r from-primary to-cyan-500 text-white text-center py-2 text-xs font-medium tracking-wide">
          🎉 Free Shipping on orders over Rs. 5,000 &nbsp;|&nbsp; 30-Day Easy Returns
        </div>

        {/* ── Main nav row ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group"
            >
              <Logo />
            </Link>

            {/* Category Dropdown — desktop */}
            <div className="relative hidden lg:block flex-shrink-0" ref={catRef}>
              <button
                onClick={() => { setIsCatOpen(!isCatOpen); setIsUserOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isCatOpen
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                    : 'border-border dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:text-primary bg-white dark:bg-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-[calc(100%+10px)] left-0 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-border-dark shadow-card-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Shop by Category
                      </div>
                      {CATEGORY_LINKS.map((cat) => (
                        <Link
                          key={cat.name}
                          to={`/products?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => setIsCatOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary transition-colors group"
                        >
                          <span className="text-xl flex-shrink-0">{cat.emoji}</span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                              {cat.name}
                            </div>
                            {cat.sub && (
                              <div className="text-[11px] text-slate-400 truncate">{cat.sub}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands…"
                  className="w-full pl-11 pr-24 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-900 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">

              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearch(!isMobileSearchOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-border dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-border dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shadow-md shadow-primary/40"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* User account */}
              {user ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => { setIsUserOpen(!isUserOpen); setIsCatOpen(false); }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-border dark:border-border-dark hover:border-primary transition-all duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate group-hover:text-primary transition-colors">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-border-dark shadow-card-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-border dark:border-border-dark">
                          <div className="text-xs text-slate-400 font-medium">Signed in as</div>
                          <div className="text-sm font-semibold text-secondary dark:text-white truncate mt-0.5">{user.email}</div>
                          <div className="mt-1">
                            <span className={`badge text-[10px] ${user.role === 'vendor' ? 'badge-warning' : user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                              {user.role?.toUpperCase() || 'CUSTOMER'}
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to={dashboardPath}
                            onClick={() => setIsUserOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary/8 hover:text-primary dark:hover:bg-primary/10 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => { logout(); navigate('/'); setIsUserOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">Sign In</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-border dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* ── Nav links row — desktop ── */}
          <div className="hidden lg:flex items-center gap-1 pb-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-primary bg-primary/8 dark:bg-primary/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-secondary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/products"
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              New Arrivals
            </Link>
          </div>

          {/* ── Mobile search bar ── */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden lg:hidden pb-3"
              >
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products…"
                    autoFocus
                    className="w-full pl-11 pr-24 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-900 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile drawer menu ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-border dark:border-border-dark bg-white dark:bg-slate-900"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border dark:border-border-dark">
                  <div className="text-2xs font-bold uppercase tracking-widest text-slate-400 px-4 py-2">Categories</div>
                  <div className="space-y-1">
                    {CATEGORY_LINKS.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 hover:text-primary transition-colors group"
                      >
                        <span className="text-xl flex-shrink-0">{cat.emoji}</span>
                        <div>
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                            {cat.name}
                          </div>
                          {cat.sub && (
                            <div className="text-[11px] text-slate-400">{cat.sub}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
