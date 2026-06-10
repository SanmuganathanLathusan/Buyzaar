import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Share2, CheckCircle, ShieldCheck, Truck,
  Star, StarHalf, ChevronRight, Package, RotateCcw, Headphones, Minus, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS } from '../data/products';
import { apiFetch, fetchWithAuth } from '../utils/api';
import { PageSpinner } from '../components/Skeleton';

/* ── Star renderer ── */
const StarRating = ({ rating = 0, size = 'md' }) => {
  const cls = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} className={`${cls} fill-amber-400 text-amber-400`} />)}
      {half && <StarHalf className={`${cls} fill-amber-400 text-amber-400`} />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} className={`${cls} fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700`} />)}
    </div>
  );
};

const GUARANTEES = [
  { icon: Truck, label: 'Free Delivery', sub: 'On orders over Rs. 5,000' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '30-day hassle-free returns' },
  { icon: ShieldCheck, label: 'Secure Payment', sub: 'SSL encrypted checkout' },
  { icon: Headphones, label: '24/7 Support', sub: 'Dedicated help center' },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch {
        const fallback = PRODUCTS.find(
          (p) => String(p.id) === String(id) || String(p._id) === String(id)
        );
        if (fallback) setProduct(fallback);
        else setError('Product not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { toast.error('Please sign in to add items to cart'); navigate('/login'); return; }
    if (product) { addToCart(product, quantity); }
  };

  const handleBuyNow = () => {
    if (!user) { toast.error('Please sign in to buy'); navigate('/login'); return; }
    if (product) { 
      // Do not add to global CartContext, just proceed to checkout with this specific item
      navigate('/checkout', { state: { directBuy: true, product, quantity } });
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error('Please sign in to submit a review');
    }
    if (rating === 0 || !comment.trim()) {
      return toast.error('Please provide a rating and a comment');
    }

    setReviewLoading(true);
    try {
      const response = await fetchWithAuth(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, comment })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit review');
      }

      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      
      // Reload product to show new review
      const updatedProduct = await apiFetch(`/api/products/${id}`).then(res => res.json());
      setProduct(updatedProduct);
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  if (error || !product) {
    return (
      <div className="page-wrapper flex items-center justify-center">
        <div className="text-center p-10">
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-secondary dark:text-white mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-5">{error || 'This product may have been removed.'}</p>
          <Link to="/products" className="btn-primary btn-md">Browse Products</Link>
        </div>
      </div>
    );
  }

  const brand = product.vendor?.businessName || 'Buyzaar Vendor';
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div className="page-wrapper">
      <div className="page-container py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-primary transition-colors font-medium">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors font-medium">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-secondary dark:text-white font-medium line-clamp-1 max-w-xs">{product.title}</span>
        </nav>

        {/* ── Main product panel ── */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-lg p-5 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* ── Image gallery ── */}
            <div className="w-full lg:w-5/12">
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 mb-4 aspect-square border border-border dark:border-border-dark">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    src={images[selectedImage] || product.image}
                    alt={product.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/600x600/f1f5f9/94a3b8?text=No+Image'; }}
                    className="w-full h-full object-contain p-8"
                  />
                </AnimatePresence>

                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    -{product.discount}% OFF
                  </div>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl border shadow-sm transition-all ${isInWishlist(product._id || product.id)
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white dark:bg-slate-800 border-border dark:border-border-dark text-slate-400 hover:text-red-500'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product._id || product.id) ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                          ? 'border-primary shadow-md shadow-primary/20'
                          : 'border-transparent hover:border-slate-300'
                        }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ── */}
            <div className="w-full lg:w-7/12 flex flex-col">

              {/* Category + Brand */}
              <div className="flex items-center gap-3 mb-3">
                {product.category && (
                  <span className="badge badge-primary">{product.category}</span>
                )}
                <span className="text-xs text-slate-400">by <span className="text-primary font-semibold">{brand}</span></span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white leading-snug mb-3 text-balance">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating || 0} />
                <span className="text-sm text-primary font-semibold hover:underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                  {product.numReviews || product.reviews?.length || 0} reviews
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  In Stock
                </span>
              </div>

              <div className="border-t border-border dark:border-border-dark my-4" />

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-1.5">
                  <span className="text-4xl font-black text-primary tracking-tight">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-slate-400 line-through font-medium mb-0.5">
                      Rs. {product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    You save Rs. {savings.toLocaleString()}!
                  </div>
                )}
              </div>

              {/* Feature checklist */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['High Quality', 'Verified Vendor', 'Fast Shipping', 'Secure Payment'].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              <div className="border-t border-border dark:border-border-dark my-4" />

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Quantity</span>
                <div className="flex items-center gap-0 rounded-xl border border-border dark:border-border-dark overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-surface-muted dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-secondary dark:text-white bg-white dark:bg-slate-900 h-10 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-surface-muted dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Total: <span className="text-primary font-bold">Rs. {(product.price * quantity).toLocaleString()}</span>
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 btn-primary btn-lg rounded-2xl"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-secondary btn-lg rounded-2xl gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={async () => {
                    await navigator.clipboard?.writeText(window.location.href).catch(() => { });
                    toast.success('Link copied!');
                  }}
                  className="btn-ghost btn-icon rounded-2xl border border-border dark:border-border-dark h-12 w-12 flex-shrink-0"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Guarantees band ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {GUARANTEES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-secondary dark:text-white leading-snug">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Description tabs ── */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card overflow-hidden">
          <div className="flex border-b border-border dark:border-border-dark">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 text-sm font-semibold capitalize transition-colors ${activeTab === tab
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-secondary dark:hover:text-white'
                  }`}
              >
                {tab === 'reviews' ? `Reviews (${product.numReviews || product.reviews?.length || 0})` : 'Description'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8"
            >
              {activeTab === 'description' ? (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {product.description || 'No description has been provided for this product. Contact the vendor for more information.'}
                </p>
              ) : (
                <div className="space-y-8">
                  {/* Rating Summary */}
                  <div className="flex flex-col items-center py-6 border-b border-border dark:border-border-dark text-center gap-3">
                    <div className="text-5xl font-black text-secondary dark:text-white">{product.rating?.toFixed(1) || '0.0'}</div>
                    <StarRating rating={product.rating || 0} />
                    <p className="text-slate-500 text-sm">Based on {product.numReviews || product.reviews?.length || 0} reviews</p>
                  </div>
                  
                  {/* Add Review Form */}
                  <div className="bg-surface-muted dark:bg-slate-800/50 p-6 rounded-2xl">
                    <h4 className="text-base font-bold text-secondary dark:text-white mb-4">Write a Review</h4>
                    <form onSubmit={submitReview} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Rating</label>
                        <select 
                          value={rating} 
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="0">Select Rating</option>
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Comment</label>
                        <textarea 
                          rows="3" 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What did you like or dislike?"
                          className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        ></textarea>
                      </div>
                      <button type="submit" disabled={reviewLoading} className="btn-primary py-2.5 px-6 rounded-xl font-bold text-sm">
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>

                  {/* Review List */}
                  <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev._id} className="pb-6 border-b border-border dark:border-border-dark last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-secondary dark:text-white text-sm">{rev.name}</span>
                            <span className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700"} />
                            ))}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-4">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
