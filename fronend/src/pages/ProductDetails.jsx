import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background dark:bg-background-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background dark:bg-background-dark text-gray-500 text-xl">
        {error || 'Product not found'}
      </div>
    );
  }

  const brand = product.vendor?.businessName || 'Buyzaar Vendor';
  const images = [product.image]; // Our model only has one image for now
  const features = ['High Quality', 'Verified Vendor', 'Fast Shipping', 'Secure Payment'];


  return (
    <div className="bg-background dark:bg-background-dark min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="text-sm text-gray-500 mb-4">
          Home &gt; {product.category} &gt; <span className="text-gray-900 dark:text-white font-medium">{brand}</span>
        </div>

        <div className="bg-white dark:bg-cardDark rounded-sm border border-gray-100 dark:border-gray-800 p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-8">
          
          {/* Image Gallery */}
          <div className="w-full md:w-5/12">
            <div className="relative pt-[100%] rounded-md overflow-hidden bg-gray-100 mb-4 border border-gray-100 dark:border-gray-700">
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage] || product.image} 
                alt={product.title} 
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(idx)} 
                  className={`w-16 h-16 rounded cursor-pointer border-2 overflow-hidden ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover hover:opacity-80" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-7/12 flex flex-col">
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 leading-tight mb-2">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center text-yellow-500">
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}
                <span className="text-primary ml-2 hover:underline cursor-pointer">{product.reviews} Ratings</span>
              </div>
              <span className="text-gray-300">|</span>
              <div>Brand: <span className="text-primary hover:underline cursor-pointer font-medium">{brand}</span></div>
            </div>

            <hr className="my-4 border-gray-100 dark:border-gray-800" />

            {/* Pricing Section */}
            <div className="mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl font-bold text-primary tracking-tight">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {product.originalPrice && <span className="text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>}
                {product.discount > 0 && <span className="text-gray-800 dark:text-gray-200 font-medium">-{product.discount}%</span>}
              </div>
            </div>

            {/* Features list */}
            <div className="mb-6 space-y-2">
              {features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feat}
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-100 dark:border-gray-800" />

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Quantity</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                >-</button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center bg-transparent border-none focus:outline-none dark:text-white"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                >+</button>
              </div>
            </div>

            {/* Call to actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
              <Link to="/checkout" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-bold text-center transition-colors shadow-md shadow-blue-500/30">
                Buy Now
              </Link>
              <button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-bold text-center shadow-md shadow-primary/30 flex justify-center items-center gap-2 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
            
            <div className="flex items-center gap-6 mt-6 justify-center sm:justify-start">
               <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                 <Heart className="w-5 h-5" /> Add to Wishlist
               </button>
               <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                 <Share2 className="w-5 h-5" /> Share
               </button>
            </div>

          </div>
        </div>

        {/* Product Details Tabs (Optional Extra) */}
        <div className="bg-white dark:bg-cardDark rounded-sm border border-gray-100 dark:border-gray-800 p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-8">
          <div className="w-full">
             <h2 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">Product Description</h2>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
               {product.description || "No description provided for this product."}
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
