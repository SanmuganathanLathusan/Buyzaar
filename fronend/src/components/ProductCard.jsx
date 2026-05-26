import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Eye, Star, StarHalf, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Render star rating ── */
const StarRating = ({ rating = 0 }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full  }).map((_, i) => <Star     key={`f${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
      {half && <StarHalf className="w-3 h-3 fill-amber-400 text-amber-400" />}
      {Array.from({ length: empty }).map((_, i) => <Star     key={`e${i}`} className="w-3 h-3 fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700" />)}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user }      = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate      = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, 1);

  };

  const discountPct = product.discount > 0 ? product.discount : null;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
      className="group relative bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card hover:shadow-card-xl overflow-hidden flex flex-col h-full transition-shadow duration-300"
    >
      {/* ── Image section ── */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Aspect ratio box */}
        <div className="relative pt-[100%]">
          <Link to={`/product/${product._id || product.id}`} className="absolute inset-0 flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.title}
              onError={(e) => { e.target.src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image'; }}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 will-change-transform"
            />
          </Link>
        </div>

        {/* Discount badge */}
        {discountPct && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md shadow-red-500/30 pointer-events-none">
            -{discountPct}%
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            title="Add to cart"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-glow transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
            title={isInWishlist(product._id || product.id) ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border shadow-md transition-all duration-200 ${
              isInWishlist(product._id || product.id)
                ? 'bg-red-50 border-red-200 text-red-500 shadow-red-500/20'
                : 'bg-white dark:bg-slate-800 border-border dark:border-border-dark text-slate-400 hover:text-red-500 hover:border-red-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product._id || product.id) ? 'fill-red-500' : ''}`} />
          </motion.button>

          <Link
            to={`/product/${product._id || product.id}`}
            title="Quick view"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border dark:border-border-dark shadow-md hover:border-primary hover:text-primary transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* ── Content section ── */}
      <Link to={`/product/${product._id || product.id}`} className="flex flex-col flex-1 p-4 gap-2">
        {/* Category pill */}
        {product.category && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary dark:text-primary-200">
            {product.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-[13px] font-semibold text-secondary dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[36px]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating || 0} />
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            ({product.numReviews || product.reviews?.length || 0})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-primary">
            Rs. {product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">
              Rs. {product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">In Stock</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
