import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Tags, Smartphone, Laptop, Tv, Headphones, Watch, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

const DUMMY_BANNERS = [
  { id: 1, title: 'Mega Sale Up To 70% Off', bg: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { id: 2, title: 'Electronics Week', bg: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { id: 3, title: 'New Arrivals 2026', bg: 'bg-gradient-to-r from-green-500 to-teal-500' },
];

const CATEGORY_ICONS = {
  Mobiles: Smartphone,
  Laptops: Laptop,
  TVs: Tv,
  Audio: Headphones,
  Watches: Watch,
  Cameras: Camera,
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DUMMY_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % DUMMY_BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + DUMMY_BANNERS.length) % DUMMY_BANNERS.length);

  return (
    <div className="w-full bg-background dark:bg-background-dark min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Banner Carousel */}
        <div className="relative h-[250px] md:h-[400px] w-full rounded-2xl overflow-hidden flex items-center shadow-lg group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 flex items-center justify-center ${DUMMY_BANNERS[currentSlide].bg} text-white`}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">{DUMMY_BANNERS[currentSlide].title}</h2>
            </motion.div>
          </AnimatePresence>
          
          <button onClick={prevSlide} className="absolute left-4 md:left-6 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 md:right-6 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {DUMMY_BANNERS.map((_, i) => (
              <button 
                key={i} 
                className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2.5 hover:bg-white/70'}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <section className="pt-4">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Tags className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white tracking-tight">Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-gray-100">
            {CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.name] || Tags;
              return (
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02 }}
                  key={cat.id} 
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                  className="bg-white dark:bg-cardDark rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-800/80 p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full group-hover:bg-primary/10 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-secondary dark:text-gray-300 group-hover:text-primary transition-all duration-300" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="bg-white dark:bg-cardDark p-6 rounded-2xl shadow-sm border border-orange-100/50 dark:border-orange-500/20 mt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between border-b pb-5 mb-6 border-gray-100 dark:border-gray-800 relative z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2.5">
                <Zap className="w-7 h-7 fill-primary animate-pulse" />
                Flash Sale
              </h2>
              <div className="bg-red-500 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-mono font-bold shadow-md shadow-red-500/20">
                <span>12</span><span className="opacity-70">:</span><span>45</span><span className="opacity-70">:</span><span>30</span>
              </div>
            </div>
            <button className="text-primary font-bold hover:text-primary-hover transition-colors text-sm uppercase tracking-wider group flex items-center gap-1">
              Shop More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {PRODUCTS.slice(0, 6).map(product => (
              <ProductCard key={`flash-${product.id}`} product={product} />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="mt-8">
          <div className="flex items-center gap-2.5 mb-6">
             <div className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white tracking-tight">Just For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PRODUCTS.slice(0, visibleCount).map((product, idx) => (
              <ProductCard key={`trending-${product.id}-${idx}`} product={product} />
            ))}
          </div>
          
          {visibleCount < PRODUCTS.length && (
            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="border-[1.5px] border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-primary/90 dark:text-primary-light dark:border-primary-light dark:hover:text-white px-10 py-3 rounded-full font-bold transition-all uppercase tracking-wide w-full sm:w-auto hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(248,86,6,0.3)] hover:-translate-y-0.5"
              >
                Load More
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
