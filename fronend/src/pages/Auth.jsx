import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Mail, Lock, User, Github, Chrome, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const payload = {
          credential: tokenResponse.access_token,
          role: userType,
          businessName: userType === 'vendor' ? formData.name : undefined
        };

        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Google Auth failed');
        }

        login(data, data.token);
        toast.success(`${userType === 'vendor' ? 'Vendor' : 'Customer'} logged in with Google successfully!`);
        
        if (data.role === 'vendor') {
          navigate('/vendor-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Login Failed');
    }
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password, 
            role: userType,
            businessName: userType === 'vendor' ? formData.name : undefined
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        login(data, data.token);
        toast.success(`${userType === 'vendor' ? 'Vendor' : 'Customer'} logged in successfully!`);
        
        if (data.role === 'vendor') {
          navigate('/vendor-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        toast.success(`${userType === 'vendor' ? 'Vendor' : 'Customer'} account created successfully! Please log in.`);
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error('Please enter your email');
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success(data.message);
      setIsForgotPassword(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="bg-background dark:bg-background-dark min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-cardDark w-full max-w-md rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 p-8"
        >
          <button 
            onClick={() => setIsForgotPassword(false)}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors mt-6 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'}`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-background-dark min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-cardDark w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <ShoppingCart className="h-8 w-8 text-primary" strokeWidth={2.5} />
              <span className="tracking-tight">Buyzaar</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-2 tracking-tight">
            {userType === 'vendor' 
              ? (isLogin ? 'Vendor Portal' : 'Become a Vendor') 
              : (isLogin ? 'Welcome Back' : 'Create an Account')}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            {userType === 'vendor'
              ? (isLogin ? 'Manage your store and products' : 'Start selling on Buyzaar today')
              : (isLogin ? 'Login with your email and password' : 'Join us and start shopping today')}
          </p>

          <div className="flex bg-gray-50 dark:bg-gray-800/80 p-1.5 rounded-xl mb-8 border border-gray-100 dark:border-gray-700/50">
            <button
              type="button"
              onClick={() => setUserType('customer')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${userType === 'customer' ? 'bg-white dark:bg-cardDark shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setUserType('vendor')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${userType === 'vendor' ? 'bg-white dark:bg-cardDark shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userType === 'vendor' ? 'Business Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300"
                      placeholder={userType === 'vendor' ? 'Super Electronics Ltd.' : 'John Doe'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-3 py-2.5 border border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs font-semibold text-primary hover:text-primary-hover"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-3 py-2.5 border border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary/20 text-sm font-bold text-white transition-all duration-300 mt-6 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-cardDark text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 gap-3">
              <button 
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 dark:border-gray-700/80 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                <img className="h-5 w-5 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
                Continue with Google
              </button>
            </div>
          </div>

        </div>
        
        <div className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 p-4 shrink-0 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
