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
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 hover:shadow-glow focus:ring-primary",
    secondary: "bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200 border border-border dark:border-border-dark hover:border-primary hover:text-primary transition-all focus:ring-primary",
    ghost: "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-surface-muted dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    icon: "p-2.5",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
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
