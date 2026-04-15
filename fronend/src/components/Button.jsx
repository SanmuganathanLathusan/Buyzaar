import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  onClick, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-sm focus:ring-primary shadow-primary/30 dark:shadow-none dark:hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)] dark:hover:bg-primary-hover",
    secondary: "bg-white dark:bg-cardDark text-primary border border-primary hover:bg-primary/5 dark:hover:bg-primary/10 focus:ring-primary",
    ghost: "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-semibold",
    icon: "p-2",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      onClick={disabled ? null : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
