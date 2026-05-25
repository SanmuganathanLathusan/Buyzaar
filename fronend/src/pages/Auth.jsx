import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Mail, Lock, User, ArrowLeft, Zap, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { apiFetch } from '../utils/api';
import authBanner from '../assets/auth_delivery_banner.png';

/* ── Field wrapper with icon ── */
const Field = ({ label, icon: Icon, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />}
      {children}
    </div>
    {hint && <p className="text-xs text-slate-400 pl-1">{hint}</p>}
  </div>
);

const inputCls = 'w-full pl-11 pr-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 outline-none';

const BENEFITS = ['Shop from thousands of products', 'Exclusive deals & offers', 'Fast, reliable delivery', 'Easy order tracking'];

const Auth = () => {
  const [isLogin,          setIsLogin]          = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [userType,         setUserType]         = useState('customer');
  const [showPass,         setShowPass]         = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestAccess, setIsRequestAccess] = useState(false);
  const [isRequestSubmittedSuccessfully, setIsRequestSubmittedSuccessfully] = useState(false);
  const [vendorRequestData, setVendorRequestData] = useState({
    fullName: '',
    shopName: '',
    phone: '',
    businessAddress: '',
    businessType: '',
    email: '',
    reason: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVendorInputChange = (e) =>
    setVendorRequestData({ ...vendorRequestData, [e.target.name]: e.target.value });

  const handleVendorRequestSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/vendor-access/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorRequestData)
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${text || 'No response'}`);
      }
      
      if (!response.ok) throw new Error(data.message || 'Request failed');
      
      setIsRequestSubmittedSuccessfully(true);
      toast.success('Access request submitted successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const payload = {
          credential:   tokenResponse.access_token,
          role:         userType,
          businessName: userType === 'vendor' ? formData.name : undefined
        };
        const response = await apiFetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        // Parse JSON safely
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Server returned ${response.status}: ${text || 'No response'}`);
        }
        
        if (!response.ok) throw new Error(data.message || 'Google Auth failed');
        login(data, data.token);
        toast.success('Signed in with Google!');
        navigate(data.role === 'vendor' ? '/vendor-dashboard' : '/user-dashboard');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => toast.error('Google login failed')
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload  = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, role: userType, businessName: userType === 'vendor' ? formData.name : undefined };

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Parse JSON safely
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${text || 'No response'}`);
      }
      
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      if (isLogin) {
        login(data, data.token);
        toast.success('Welcome back! 👋');
        navigate(data.role === 'vendor' ? '/vendor-dashboard' : data.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
      } else {
        toast.success('Account created! Please sign in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error('Please enter your email');
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      // Parse JSON safely
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${text || 'No response'}`);
      }
      
      if (!response.ok) throw new Error(data.message);
      toast.success(data.message);
      setIsForgotPassword(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Forgot password screen ── */
  if (isForgotPassword) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex items-center justify-center p-4 bg-background dark:bg-background-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-surface-dark w-full max-w-md rounded-3xl shadow-card-xl border border-border dark:border-border-dark p-8"
        >
          <button
            onClick={() => setIsForgotPassword(false)}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary mb-7 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-secondary dark:text-white mb-1">Reset Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Enter your email address and we'll send you a reset link.
          </p>

          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <Field label="Email Address" icon={Mail}>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleInputChange}
                className={inputCls} placeholder="name@example.com"
              />
            </Field>
            <button
              type="submit" disabled={isLoading}
              className="btn-primary btn-lg w-full rounded-2xl justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
              ) : 'Send Reset Link'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center p-4 bg-background dark:bg-background-dark">
      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-card-xl border border-border dark:border-border-dark">

        {/* ── Left brand panel (hidden on mobile) ── */}
        <div className="hidden lg:flex flex-col w-2/5 relative overflow-hidden bg-slate-900 border-r border-border dark:border-border-dark">
          {/* Main Delivery Graphic */}
          <div className="absolute inset-0 z-0">
            <img 
              src={userType === 'vendor' ? 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80' : authBanner} 
              alt={userType === 'vendor' ? 'Store Front' : 'Fast Delivery Service'} 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          </div>

          <div className="relative z-10 flex flex-col h-full p-10 justify-between text-white">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-2xl font-black tracking-tight drop-shadow-md">Buyzaar</span>
            </Link>

            <div className="mt-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-white text-xs font-bold mb-4 shadow-lg border border-white/20">
                <Zap className="w-3.5 h-3.5" />
                {userType === 'vendor' ? 'Grow Your Business' : 'Lightning Fast Delivery'}
              </div>
              <h2 className="text-3xl font-black leading-tight mb-3 drop-shadow-sm">
                {userType === 'vendor' ? 'Vendor Portal' : (isLogin ? 'Welcome back!' : 'Join Buyzaar today')}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm drop-shadow-sm">
                {userType === 'vendor'
                  ? 'Manage your storefront, upload products, track orders, and boost your sales on Sri Lanka’s premium multi-vendor network.'
                  : 'Experience seamless e-commerce with our reliable vendors and premium delivery partners across Sri Lanka.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 bg-white dark:bg-surface-dark flex flex-col">
          <div className="flex-1 p-8 md:p-10 overflow-y-auto">

            {/* Mobile logo */}
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-secondary dark:text-white">Buyzaar</span>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <h2 className="text-2xl font-black text-secondary dark:text-white">
                {isRequestSubmittedSuccessfully ? 'Request Submitted' : (
                  userType === 'vendor'
                    ? (isRequestAccess ? 'Request Vendor Access' : 'Vendor Portal')
                    : (isLogin ? 'Sign In' : 'Create Account')
                )}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isRequestSubmittedSuccessfully ? 'Thank you for your application' : (
                  userType === 'vendor'
                    ? (isRequestAccess ? 'Fill out the details to request access' : 'Enter your credentials to continue')
                    : (isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started')
                )}
              </p>
            </div>

            {/* Customer / Vendor toggle */}
            {!isRequestSubmittedSuccessfully && !isRequestAccess && (
              <div className="flex bg-surface-muted dark:bg-slate-800 p-1 rounded-2xl mb-7 border border-border dark:border-border-dark">
                {[
                  { value: 'customer', label: 'Customer', icon: '🛍️' },
                  { value: 'vendor',   label: 'Vendor',   icon: '🏪' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setUserType(opt.value);
                      setIsLogin(true);
                      setIsRequestAccess(false);
                      setIsRequestSubmittedSuccessfully(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      userType === opt.value
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-card'
                        : 'text-slate-500 hover:text-secondary dark:hover:text-white'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {isRequestSubmittedSuccessfully ? (
              <div className="text-center py-8 px-4 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-medium">
                    Your vendor access request has been submitted successfully. Admin will review it and provide your temporary password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsRequestSubmittedSuccessfully(false);
                    setIsRequestAccess(false);
                  }}
                  className="btn-primary btn-md rounded-xl justify-center gap-2 px-6 mx-auto"
                >
                  Back to Login
                </button>
              </div>
            ) : isRequestAccess && userType === 'vendor' ? (
              <form onSubmit={handleVendorRequestSubmit} className="space-y-4">
                <Field label="Full Name" icon={User}>
                  <input
                    type="text" name="fullName" required
                    value={vendorRequestData.fullName} onChange={handleVendorInputChange}
                    className={inputCls} placeholder="e.g. John Doe"
                  />
                </Field>
                <Field label="Shop / Business Name" icon={ShoppingBag}>
                  <input
                    type="text" name="shopName" required
                    value={vendorRequestData.shopName} onChange={handleVendorInputChange}
                    className={inputCls} placeholder="e.g. Acme Retail"
                  />
                </Field>
                <Field label="Phone Number" icon={User}>
                  <input
                    type="tel" name="phone" required
                    value={vendorRequestData.phone} onChange={handleVendorInputChange}
                    className={inputCls} placeholder="e.g. +94 77 123 4567"
                  />
                </Field>
                <Field label="Business Address" icon={Lock}>
                  <input
                    type="text" name="businessAddress" required
                    value={vendorRequestData.businessAddress} onChange={handleVendorInputChange}
                    className={inputCls} placeholder="e.g. 123 Main St, Colombo"
                  />
                </Field>
                <Field label="Business Type" icon={ShoppingBag}>
                  <input
                    type="text" name="businessType" required
                    value={vendorRequestData.businessType} onChange={handleVendorInputChange}
                    className={inputCls} placeholder="e.g. Electronics, Clothing, Grocery"
                  />
                </Field>
                <Field label="Email Address" icon={Mail}>
                  <input
                    type="email" name="email" required
                    value={vendorRequestData.email} onChange={handleVendorInputChange}
                    className={inputCls} placeholder="e.g. contact@acme.com"
                  />
                </Field>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Reason for joining
                  </label>
                  <textarea
                    name="reason" required
                    value={vendorRequestData.reason} onChange={handleVendorInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 outline-none min-h-[80px]"
                    placeholder="Briefly explain why you want to sell with us..."
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit" disabled={isLoading}
                    className="btn-primary btn-lg w-full rounded-2xl justify-center gap-2"
                  >
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                    ) : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRequestAccess(false)}
                    className="w-full py-3 text-sm font-semibold text-slate-500 hover:text-secondary dark:hover:text-white transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <Field label={userType === 'vendor' ? 'Business Name' : 'Full Name'} icon={User}>
                          <input
                            type="text" name="name" required={!isLogin}
                            value={formData.name} onChange={handleInputChange}
                            className={inputCls}
                            placeholder={userType === 'vendor' ? 'e.g. Super Electronics Ltd.' : 'e.g. Lathusan'}
                          />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Field label="Email Address" icon={Mail}>
                    <input
                      type="email" name="email" required
                      value={formData.email} onChange={handleInputChange}
                      className={inputCls} placeholder="lathu@example.com"
                    />
                  </Field>

                  <Field label="Password" icon={Lock}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="password" required
                      value={formData.password} onChange={handleInputChange}
                      className={`${inputCls} pr-11`} placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </Field>

                  {isLogin && userType !== 'vendor' && (
                    <div className="flex justify-end -mt-1">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit" disabled={isLoading}
                    className="btn-primary btn-lg w-full rounded-2xl justify-center gap-2 mt-1"
                  >
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                    ) : isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                {userType === 'vendor' && (
                  <div className="text-center pt-4 border-t border-dashed border-border dark:border-border-dark mt-4">
                    <p className="text-xs text-slate-500">New vendor or don't have access?</p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRequestAccess(true);
                        setIsRequestSubmittedSuccessfully(false);
                      }}
                      className="mt-1 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                    >
                      Request Vendor Access
                    </button>
                  </div>
                )}

                {userType !== 'vendor' && (
                  <>
                    {/* Divider */}
                    <div className="divider my-6 text-xs">OR</div>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={() => handleGoogleLogin()}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-sm font-semibold text-secondary dark:text-white hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-card-md transition-all duration-200"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google"
                        className="w-5 h-5"
                      />
                      Continue with Google
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Bottom switch */}
          {userType !== 'vendor' && (
            <div className="bg-surface-muted dark:bg-slate-800/50 border-t border-border dark:border-border-dark px-10 py-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setFormData({ name: '', email: '', password: '' }); }}
                  className="font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  {isLogin ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default Auth;
