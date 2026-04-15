import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
      className={clsx('bg-gray-200 dark:bg-gray-700 rounded-md', className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-cardDark rounded-sm border border-gray-100 dark:border-gray-800 p-3 h-full flex flex-col gap-3">
    <Skeleton className="w-full pt-[100%]" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-3 w-1/4 mt-2" />
    <Skeleton className="h-10 w-full mt-auto" />
  </div>
);

export default Skeleton;
