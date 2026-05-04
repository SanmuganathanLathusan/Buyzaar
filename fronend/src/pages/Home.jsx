import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Truck, Headphones, Percent, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

const Home = () => {
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  // Sidebar Categories (Matches the image)
  const sidebarCategories = [
    'Fashion Collection',
    'Electronics Item',
    'Home Appliance',
    'Kitchen Item',
    'Furniture',
    'Food',
    'Gadgets',
    'Toys and Games',
    'Health & beauty'
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'Minimum order $90' },
    { icon: Headphones, title: '24/7 Support', desc: 'Contact us 24 Hours' },
    { icon: Percent, title: 'Best Prices & offers', desc: 'Order $100 or more' },
    { icon: RefreshCw, title: 'Easy Returns', desc: 'Within 30 Days' },
  ];

  return (
    <div className="w-full bg-white dark:bg-background-dark min-h-screen pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        
        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar Categories */}
          <div className="hidden lg:block w-[250px] bg-white dark:bg-cardDark border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm flex-shrink-0">
            <div className="flex flex-col py-2">
              {sidebarCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(`/products?category=${cat}`)}
                  className={`flex items-center justify-between px-6 py-3 cursor-pointer text-sm font-medium transition-colors ${
                    idx === 1 
                      ? 'bg-blue-50 text-primary border-l-2 border-primary' // Highlight Electronics to match image
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              ))}
              <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                 <button onClick={() => navigate('/products')} className="text-primary text-sm font-semibold flex items-center justify-between w-full">
                    View All Categories <span className="text-lg">+</span>
                 </button>
              </div>
            </div>
          </div>

          {/* Right Hero Banner */}
          <div className="flex-1 relative bg-[#EAF5FF] dark:bg-gray-800 rounded-xl overflow-hidden flex items-center min-h-[400px]">
            <div className="px-10 py-12 z-10 max-w-lg">
              <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">Up to <span className="text-primary font-bold text-xl">70%</span> of on Black Friday</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">
                TRENDY <span className="text-primary">FASHION</span><br/>COLLECTION
              </h1>
              <button 
                onClick={() => navigate('/products')}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-md font-semibold transition-colors shadow-lg shadow-primary/30"
              >
                Buy Now
              </button>
            </div>
            
            {/* Background Image of the Woman */}
            <div className="absolute right-0 bottom-0 h-full w-1/2 flex justify-end">
              <img 
                src="/images/hero_banner_woman_1777814059468.png" 
                alt="Trendy Fashion" 
                className="h-full object-cover object-right"
              />
            </div>
          </div>
        </div>

        {/* Promo Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Promo 1 */}
          <div className="bg-[#F0F8FF] dark:bg-gray-800 rounded-xl p-5 flex justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
            <div className="z-10 w-2/3">
              <p className="text-xs text-gray-500 font-medium mb-1">Gadget Store</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">30% Sale</h3>
              <span className="text-sm font-semibold text-red-500 flex items-center gap-1 group-hover:underline">
                <span className="text-red-500">🛍</span> Buy Now
              </span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1/2">
              <img src="/images/promo_earbuds_1777814089396.png" alt="Earbuds" className="w-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform" />
            </div>
          </div>

          {/* Promo 2 */}
          <div className="bg-[#FFF4E6] dark:bg-gray-800 rounded-xl p-5 flex justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
            <div className="z-10 w-2/3">
              <p className="text-xs text-gray-500 font-medium mb-1">Bundle Package</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Save 30%</h3>
              <span className="text-sm font-semibold text-red-500 group-hover:underline">See All</span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1/2">
              <img src="/images/promo_chocolates_1777814134245.png" alt="Chocolates" className="w-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform" />
            </div>
          </div>

          {/* Promo 3 */}
          <div className="bg-[#F0F8FF] dark:bg-gray-800 rounded-xl p-5 flex justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
            <div className="z-10 w-2/3">
              <p className="text-xs text-gray-500 font-medium mb-1">Valentines Offer</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">30% Sale</h3>
              <span className="text-sm font-semibold text-red-500 flex items-center gap-1 group-hover:underline">
                <span className="text-red-500">🛍</span> Buy Now
              </span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1/2">
               <img src="/images/promo_ring_1777814170273.png" alt="Ring" className="w-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform" />
            </div>
          </div>

          {/* Promo 4 */}
          <div className="bg-[#FFF0F5] dark:bg-gray-800 rounded-xl p-5 flex justify-between relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
             <div className="z-10 w-2/3">
              <p className="text-xs text-gray-500 font-medium mb-1">Relax Chair</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Arrival</h3>
              <span className="text-sm font-semibold text-red-500 flex items-center gap-1 group-hover:underline">
                <span className="text-red-500">🛍</span> Buy Now
              </span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1/2">
               <img src="/images/promo_chair_1777814269040.png" alt="Chair" className="w-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform" />
            </div>
          </div>

        </div>

        {/* Main Content Area: Features Sidebar + Featured Items */}
        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          
          {/* Left Features Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 w-[250px] flex-shrink-0">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white dark:bg-cardDark border border-gray-100 dark:border-gray-800 rounded-lg p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="text-primary text-3xl">
                     <Icon className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Featured Items */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Item</h2>
              <div className="flex gap-2">
                <button className="p-1 text-gray-400 hover:text-primary transition-colors"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                <button className="p-1 text-primary transition-colors"><ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {PRODUCTS.slice(0, 8).map((product, idx) => (
                <ProductCard key={`featured-${product.id}-${idx}`} product={product} />
              ))}
            </div>

            {visibleCount < PRODUCTS.length && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 px-8 py-2.5 rounded-full font-medium transition-all text-sm"
                >
                  Load More
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
