import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login first to add products to cart!');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
  };

  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-cardDark rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-gray-200 transition-all duration-300 group shadow-sm flex flex-col h-full relative"
    >
      <div className="relative pt-[100%] overflow-hidden bg-gray-50/50 dark:bg-gray-800/20 p-4">
        <Link to={`/product/${product._id || product.id}`} className="absolute inset-0">
          <img 
            src={product.image} 
            alt={product.title} 
            onError={(e) => { e.target.src = 'https://placehold.co/500x500/eeeeee/999999?text=No+Image'; }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-105 will-change-transform"
          />
        </Link>
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#FF4747] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm pointer-events-none">
            -{product.discount}%
          </div>
        )}

        {/* Hover Action Buttons - Now outside Link to prevent incorrect navigation bubbling */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0 z-20">
          <button 
            onClick={handleAddToCart} 
            className="bg-primary text-white p-1.5 rounded-full hover:bg-primary-hover shadow-sm transition-transform hover:scale-110"
          >
             <ShoppingCart className="w-4 h-4" />
          </button>

          <Link 
            to={`/product/${product._id || product.id}`}
            className="bg-white text-gray-500 p-1.5 rounded-full hover:text-primary shadow-sm border border-gray-100 flex items-center justify-center transition-transform hover:scale-110"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </Link>
        </div>
      </div>
      
      <Link to={`/product/${product._id || product.id}`} className="p-4 flex-grow block">
        <h3 className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors min-h-[36px]">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center text-yellow-400 text-xs">
            {'★'.repeat(Math.round(product.rating))}
            <span className="text-gray-400 dark:text-gray-500 ml-1 font-medium select-none">({product.reviews})</span>
          </div>
          <span className="text-[10px] text-green-500 font-medium">Stock Available</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
           <span className="text-base font-bold text-primary">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
             <span className="text-xs font-medium text-gray-400 line-through">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
