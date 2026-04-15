import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-cardDark rounded-sm overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/20 dark:hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
    >
      <Link to={`/product/${product._id || product.id}`} className="block relative">
        <div className="relative pt-[100%] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={product.image} 
            alt={product.title} 
            onError={(e) => { e.target.src = 'https://placehold.co/500x500/eeeeee/999999?text=No+Image'; }}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="flex flex-col gap-0.5 mt-2">
            <span className="text-lg font-bold text-primary">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.round(product.rating))}
              <span className="text-gray-400 dark:text-gray-500 ml-1 select-none">({product.reviews})</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-3 pb-3">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all duration-300 rounded py-2 text-sm font-medium"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
