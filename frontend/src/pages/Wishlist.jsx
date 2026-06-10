import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="page-wrapper pt-8 pb-16">
      <div className="page-container">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary dark:text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              My Wishlist
            </h1>
            <p className="text-slate-500 mt-1">
              {wishlistCount === 0 
                ? "You haven't saved any items yet." 
                : `You have ${wishlistCount} item${wishlistCount === 1 ? '' : 's'} saved.`}
            </p>
          </div>
          
          {wishlistCount > 0 && (
            <Link to="/products" className="btn-ghost btn-md gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          )}
        </div>

        {wishlistCount === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-border dark:border-border-dark p-16 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-secondary dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Save items you love to your wishlist and they'll show up here so you can easily find them later.
            </p>
            <Link to="/products" className="btn-primary btn-lg rounded-2xl px-12">
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
