import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();

  const shipping = cartSubtotal > 0 ? (cartSubtotal >= 5000 ? 0 : 500) : 0;
  const total    = cartSubtotal + shipping;

  return (
    <div className="page-wrapper">
      <div className="page-container py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {cartItems.length === 0
              ? 'Your cart is empty'
              : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-cyan-100 dark:from-primary/20 dark:to-cyan-900/30 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-secondary dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-8">
              Looks like you haven't added anything yet. Discover amazing products waiting for you!
            </p>
            <Link to="/products" className="btn-primary btn-lg gap-2">
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Cart items ── */}
            <div className="flex-1 space-y-3">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id || item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-border dark:border-border-dark shadow-card hover:shadow-card-md transition-shadow items-start sm:items-center"
                  >
                    {/* Product image */}
                    <Link
                      to={`/product/${item._id || item.id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-border dark:border-border-dark flex items-center justify-center p-2"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => { e.target.src = 'https://placehold.co/200x200/f1f5f9/94a3b8?text=N/A'; }}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item._id || item.id}`}>
                        <h3 className="font-semibold text-secondary dark:text-white text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base font-bold text-primary">
                          Rs. {item.price?.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            Rs. {item.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity stepper */}
                      <div className="flex items-center rounded-xl border border-border dark:border-border-dark overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id || item._id, -1)}
                          className="w-9 h-9 flex items-center justify-center bg-surface-muted dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-secondary dark:text-white bg-white dark:bg-slate-900 h-9 flex items-center justify-center border-x border-border dark:border-border-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id || item._id, 1)}
                          className="w-9 h-9 flex items-center justify-center bg-surface-muted dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-bold text-secondary dark:text-white min-w-[80px] text-right">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id || item._id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue shopping */}
              <div className="pt-2">
                <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-lg p-6 sticky top-24">
                <h2 className="text-lg font-bold text-secondary dark:text-white mb-5">Order Summary</h2>

                {/* Coupon input */}
                <div className="flex gap-2 mb-5">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800">
                    <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="w-full bg-transparent text-sm text-secondary dark:text-white placeholder:text-slate-400 outline-none"
                    />
                  </div>
                  <button className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-border dark:border-border-dark">
                    Apply
                  </button>
                </div>

                {/* Line items */}
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-semibold text-secondary dark:text-white">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500' : 'text-secondary dark:text-white'}`}>
                      {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {cartSubtotal > 0 && cartSubtotal < 5000 && (
                    <div className="text-xs text-slate-500 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-xl">
                      Add Rs. {(5000 - cartSubtotal).toLocaleString()} more for free shipping!
                    </div>
                  )}
                </div>

                <div className="border-t border-border dark:border-border-dark pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-secondary dark:text-white">Total</span>
                    <span className="text-2xl font-black text-primary">Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">VAT included, where applicable</div>
                </div>

                <Link
                  to="/checkout"
                  className="btn-primary btn-lg w-full rounded-2xl justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Secure checkout — 256-bit SSL encryption
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
