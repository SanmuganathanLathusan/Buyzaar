import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-cardDark rounded-2xl overflow-hidden border border-gray-100/80 dark:border-gray-800/80 hover:border-primary/30 transition-all duration-300 group shadow-sm hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] dark:shadow-none dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col h-full"
    >
      <Link to={`/product/${product._id || product.id}`} className="block relative">
        <div className="relative pt-[100%] overflow-hidden bg-gray-50 dark:bg-gray-800/50">
          <img 
            src={product.image} 
            alt={product.title} 
            onError={(e) => { e.target.src = 'https://placehold.co/500x500/eeeeee/999999?text=No+Image'; }}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          />
          {product.discount > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-extrabold tracking-wide px-2.5 py-1.5 rounded-full shadow-lg">
              -{product.discount}%
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 md:text-base leading-tight mb-2 group-hover:text-primary transition-colors h-10">
            {product.title}
          </h3>
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-primary">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-medium text-gray-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center text-yellow-400 text-xs">
              {'★'.repeat(Math.round(product.rating))}
              <span className="text-gray-400 dark:text-gray-500 ml-1.5 font-medium select-none">({product.reviews})</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4 pt-1 mt-auto">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary text-primary hover:text-white transition-all duration-300 rounded-xl py-2.5 text-sm font-semibold group/btn"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
