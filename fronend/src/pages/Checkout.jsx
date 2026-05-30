import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, Banknote, Truck, ShieldCheck, Lock,
  CheckCircle, MapPin, Phone, User, Mail, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/* ── Step indicator ── */
const STEPS = ['Delivery', 'Payment', 'Review'];

const StepBar = ({ current }) => (
  <div className="flex items-center mb-8">
    {STEPS.map((step, idx) => {
      const done    = idx < current;
      const active  = idx === current;
      return (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              done   ? 'bg-emerald-500 text-white' :
              active ? 'bg-primary text-white shadow-md shadow-primary/30' :
                       'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-sm font-semibold hidden sm:block ${
              active ? 'text-primary' :
              done   ? 'text-emerald-600 dark:text-emerald-400' :
                       'text-slate-400'
            }`}>{step}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors ${done ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ── Styled input ── */
const FormField = ({ label, icon: Icon, children, required }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />}
      {children}
    </div>
  </div>
);

const inputCls = (hasIcon) =>
  `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200`;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartSubtotal, clearCart, cartItems } = useCart();
  const { token } = useAuth();
  
  // Direct buy logic
  const isDirectBuy = location.state?.directBuy;
  const directProduct = location.state?.product;
  const directQuantity = location.state?.quantity || 1;
  const checkoutItems = isDirectBuy && directProduct ? [{
    product: directProduct._id,
    title: directProduct.title,
    image: directProduct.image,
    price: directProduct.price,
    qty: directQuantity,
    vendor: directProduct.vendor?._id || directProduct.vendor
  }] : cartItems;
  const subtotalToUse = isDirectBuy && directProduct ? (directProduct.price * directQuantity) : cartSubtotal;

  useEffect(() => {
    if (!token) { toast.error('Please sign in to access checkout'); navigate('/login'); }
    if (checkoutItems.length === 0) {
      toast('Your cart is empty.');
      navigate('/products');
    }
  }, [token, navigate, checkoutItems.length]);

  const [step,          setStep]          = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting,  setIsSubmitting]  = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', city: '', postalCode: '',
    cardNumber: '', cardExpiry: '', cardCvc: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const shipping = subtotalToUse > 0 ? (subtotalToUse >= 5000 ? 0 : 500) : 0;
  const total    = subtotalToUse + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('You must be logged in to place an order.'); navigate('/login'); return; }
    if (checkoutItems.length === 0) { toast.error('Your cart/order is empty'); return; }
    
    // Validate form fields
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone) {
      toast.error('Please fill in all shipping details');
      return;
    }

    const hasLegacyItems = checkoutItems.some((item) => {
      const idToCheck = isDirectBuy ? item.product : item._id;
      return !idToCheck || idToCheck.toString().length !== 24;
    });
    if (hasLegacyItems) {
      toast.error('Your order contains demo items that cannot be purchased. Please add real products!');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = checkoutItems.map((item) => ({
        product: isDirectBuy ? item.product : item._id,
        title:   item.name || item.title,
        qty:     isDirectBuy ? item.qty : item.quantity,
        price:   item.price,
        image:   item.image || (item.images && item.images[0]) || ''
      }));

      const orderPayload = {
        orderItems,
        shippingAddress: {
          fullName:   formData.fullName,
          address:    formData.address,
          city:       formData.city,
          postalCode: formData.postalCode || '',
          phone:      formData.phone
        },
        paymentMethod,
        itemsPrice:   subtotalToUse,
        shippingPrice: shipping,
        totalPrice:   total
      };

      const response = await fetchWithAuth('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        toast.success('Order placed successfully! 🎉', { duration: 4000 });
        if (!isDirectBuy) {
          clearCart();
        }
        setTimeout(() => navigate('/user-dashboard'), 1500);
      } else {
        const errData = await response.json();
        toast.error(errData.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-container py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary dark:text-white tracking-tight">Checkout</h1>
          <p className="text-slate-500 text-sm mt-1">Complete your purchase securely</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left: form ── */}
            <div className="flex-1 space-y-5">
              <StepBar current={step} />

              {/* ── Step 0: Delivery ── */}
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-secondary dark:text-white">Delivery Information</h2>
                        <p className="text-xs text-slate-400">Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Full Name" icon={User} required>
                        <input required name="fullName" value={formData.fullName} onChange={handleChange}
                          type="text" className={inputCls(true)} placeholder="Lathusan" />
                      </FormField>
                      <FormField label="Phone Number" icon={Phone} required>
                        <input required name="phone" value={formData.phone} onChange={handleChange}
                          type="tel" className={inputCls(true)} placeholder="+94 77 8410 323" />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Street Address" icon={MapPin} required>
                          <input required name="address" value={formData.address} onChange={handleChange}
                            type="text" className={inputCls(true)} placeholder="House No, Street, Area" />
                        </FormField>
                      </div>
                      <FormField label="City" icon={MapPin} required>
                        <input required name="city" value={formData.city} onChange={handleChange}
                          type="text" className={inputCls(true)} placeholder="Colombo" />
                      </FormField>
                      <FormField label="Postal Code" icon={Hash} required>
                        <input required name="postalCode" value={formData.postalCode} onChange={handleChange}
                          type="text" className={inputCls(true)} placeholder="10100" />
                      </FormField>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
                          toast.error('Please fill in all delivery fields');
                          return;
                        }
                        setStep(1);
                      }}
                      className="btn-primary btn-lg w-full mt-6 rounded-2xl justify-center"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}

                {/* ── Step 1: Payment ── */}
                {step === 1 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-secondary dark:text-white">Payment Method</h2>
                        <p className="text-xs text-slate-400">All transactions are secure and encrypted</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {[
                        { value: 'cod',  icon: Banknote,   label: 'Cash on Delivery',    sub: 'Pay when you receive', iconColor: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                        { value: 'card', icon: CreditCard, label: 'Credit / Debit Card',  sub: 'Secure online payment', iconColor: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/30' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                            paymentMethod === opt.value
                              ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10'
                              : 'border-border dark:border-border-dark hover:border-primary/40'
                          }`}
                        >
                          <input type="radio" name="payment" value={opt.value}
                            checked={paymentMethod === opt.value}
                            onChange={() => setPaymentMethod(opt.value)}
                            className="sr-only" />
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.bg}`}>
                            <opt.icon className={`w-5 h-5 ${opt.iconColor}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-secondary dark:text-white">{opt.label}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{opt.sub}</div>
                          </div>
                          <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            paymentMethod === opt.value ? 'border-primary' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {paymentMethod === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                        </label>
                      ))}
                    </div>

                    <AnimatePresence>
                      {paymentMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 space-y-4 mb-4">
                            <div className="flex items-start gap-3">
                              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Test / Demo Mode</h4>
                                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                  This is a demo project. Do not enter real payment information. For testing, you can use any dummy data below.
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-2">
                              <FormField label="Card Number (Test Only)" icon={CreditCard} required>
                                <input name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                                  placeholder="0000 0000 0000 0000" className={inputCls(true)} maxLength={19} />
                              </FormField>
                              <div className="grid grid-cols-2 gap-3">
                                <FormField label="Expiry" required>
                                  <input name="cardExpiry" value={formData.cardExpiry} onChange={handleChange}
                                    placeholder="MM / YY" className={inputCls(false)} maxLength={7} />
                                </FormField>
                                <FormField label="CVC" icon={Lock} required>
                                  <input name="cardCvc" value={formData.cardCvc} onChange={handleChange}
                                    placeholder="000" className={inputCls(true)} maxLength={4} type="password" />
                                </FormField>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(0)} className="btn-secondary btn-md rounded-2xl flex-shrink-0">
                        ← Back
                      </button>
                      <button type="button" onClick={() => setStep(2)} className="btn-primary btn-md rounded-2xl flex-1 justify-center">
                        Review Order →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Review ── */}
                {step === 2 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card p-6 md:p-8 space-y-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-secondary dark:text-white">Order Review</h2>
                        <p className="text-xs text-slate-400">Confirm your details before placing the order</p>
                      </div>
                    </div>

                    {/* Delivery summary */}
                    <div className="p-4 rounded-2xl bg-surface-muted dark:bg-slate-800/50 border border-border dark:border-border-dark">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Delivery To</div>
                      <div className="text-sm font-semibold text-secondary dark:text-white">{formData.fullName}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{formData.address}, {formData.city} {formData.postalCode}</div>
                      <div className="text-sm text-slate-500">{formData.phone}</div>
                    </div>

                    {/* Payment summary */}
                    <div className="p-4 rounded-2xl bg-surface-muted dark:bg-slate-800/50 border border-border dark:border-border-dark">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Payment</div>
                      <div className="text-sm font-semibold text-secondary dark:text-white flex items-center gap-2">
                        {paymentMethod === 'cod' ? <><Banknote className="w-4 h-4 text-emerald-500" /> Cash on Delivery</> : <><CreditCard className="w-4 h-4 text-blue-500" /> Credit / Debit Card</>}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {checkoutItems.map((item) => (
                        <div key={item._id || item.product} className="flex items-center gap-3 py-2">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-secondary dark:text-white line-clamp-1">{item.title}</div>
                            <div className="text-xs text-slate-400">×{isDirectBuy ? item.qty : item.quantity}</div>
                          </div>
                          <div className="text-sm font-bold text-primary flex-shrink-0">
                            Rs. {(item.price * (isDirectBuy ? item.qty : item.quantity)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="btn-secondary btn-md rounded-2xl flex-shrink-0">
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary btn-md rounded-2xl flex-1 justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Place Order
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: order summary ── */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-lg p-6 sticky top-24">
                <h2 className="text-lg font-bold text-secondary dark:text-white mb-4">Order Summary</h2>

                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar mb-4">
                  {checkoutItems.map((item) => (
                    <div key={item._id || item.product} className="flex items-center gap-3 py-1.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-secondary dark:text-white line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-400">×{isDirectBuy ? item.qty : item.quantity}</div>
                      </div>
                      <span className="text-xs font-bold text-primary">Rs. {(item.price * (isDirectBuy ? item.qty : item.quantity)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border dark:border-border-dark pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Items Total</span>
                    <span className="font-semibold text-secondary dark:text-white">Rs. {subtotalToUse.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500' : 'text-secondary dark:text-white'}`}>
                      {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="border-t border-border dark:border-border-dark pt-3 flex justify-between items-center">
                    <span className="font-bold text-secondary dark:text-white text-base">Total</span>
                    <span className="text-2xl font-black text-primary">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  SSL secure & encrypted checkout
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
