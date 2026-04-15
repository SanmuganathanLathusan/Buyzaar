import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(data.message || 'Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-cardDark w-full max-w-md rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Lock className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your new password below to regain access to your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors mt-6 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'}`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
