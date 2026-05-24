import React from 'react';
import clsx from 'clsx';

/* Reusable Skeleton atom */
const Skeleton = ({ className, ...props }) => (
  <div
    className={clsx(
      'skeleton animate-pulse',
      className
    )}
    {...props}
  />
);

/* Product card skeleton — matches the new ProductCard layout */
export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card overflow-hidden flex flex-col h-full">
    {/* Image placeholder */}
    <div className="relative pt-[100%] bg-gradient-shimmer">
      <div className="absolute inset-0" />
    </div>
    {/* Content placeholder */}
    <div className="p-4 flex flex-col gap-3 flex-1">
      <Skeleton className="h-2.5 w-16 rounded-full" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded-lg" />
      <div className="flex gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-3 h-3 rounded-full" />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-auto pt-2">
        <Skeleton className="h-5 w-24 rounded-lg" />
        <Skeleton className="h-4 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);

/* Generic horizontal list skeleton */
export const ListSkeleton = ({ rows = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark">
        <Skeleton className="w-20 h-20 flex-shrink-0 rounded-xl" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-2/3 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg mt-auto" />
        </div>
      </div>
    ))}
  </div>
);

/* Page-level full spinner */
export const PageSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-14 h-14 border-4 border-primary/20 rounded-full" />
      <div className="absolute inset-0 w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-sm text-slate-400 font-medium animate-pulse">Loading…</p>
  </div>
);

export default Skeleton;
