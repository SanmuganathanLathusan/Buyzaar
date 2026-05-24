import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Mail, Lock, User, ArrowLeft, Zap, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { apiFetch } from '../utils/api';

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
  const navigate = useNavigate();
  const { login } = useAuth();

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
        <div className="hidden lg:flex flex-col w-2/5 bg-gradient-to-br from-primary via-cyan-500 to-blue-600 p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-10">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">Buyzaar</span>
            </Link>

            <div className="flex-1">
              <h2 className="text-3xl font-black leading-tight mb-3">
                {isLogin ? 'Welcome back!' : 'Join Buyzaar today'}
              </h2>
              <p className="text-white/75 text-sm leading-relaxed mb-8">
                {isLogin
                  ? 'Sign in to access your orders, wishlist, and exclusive deals.'
                  : 'Create a free account and start discovering amazing products.'}
              </p>

              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-white/80 flex-shrink-0" />
                    <span className="text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-white/50 text-xs mt-10">© {new Date().getFullYear()} Buyzaar. All rights reserved.</p>
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
                {userType === 'vendor'
                  ? (isLogin ? 'Vendor Portal' : 'Become a Vendor')
                  : (isLogin ? 'Sign In' : 'Create Account')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
              </p>
            </div>

            {/* Customer / Vendor toggle */}
            <div className="flex bg-surface-muted dark:bg-slate-800 p-1 rounded-2xl mb-7 border border-border dark:border-border-dark">
              {[
                { value: 'customer', label: 'Customer', icon: '🛍️' },
                { value: 'vendor',   label: 'Vendor',   icon: '🏪' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUserType(opt.value)}
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

            {/* Form */}
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
                        placeholder={userType === 'vendor' ? 'e.g. Super Electronics Ltd.' : 'e.g. John Doe'}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email Address" icon={Mail}>
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleInputChange}
                  className={inputCls} placeholder="name@example.com"
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

              {isLogin && (
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
          </div>

          {/* Bottom switch */}
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
        </div>
      </div>
    </div>
  );
};

export default Auth;
