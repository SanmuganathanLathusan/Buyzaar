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
        <div className="relative h-48 md:h-80 w-full rounded-lg overflow-hidden flex items-center shadow-md group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 flex items-center justify-center ${DUMMY_BANNERS[currentSlide].bg} text-white`}
            >
              <h2 className="text-3xl md:text-5xl font-bold">{DUMMY_BANNERS[currentSlide].title}</h2>
            </motion.div>
          </AnimatePresence>
          
          <button onClick={prevSlide} className="absolute left-4 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {DUMMY_BANNERS.map((_, i) => (
              <button 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tags className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold dark:text-white">Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.name] || Tags;
              return (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={cat.id} 
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                  className="bg-white dark:bg-cardDark rounded-md shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md hover:border-primary/20 dark:hover:border-primary/50 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] transition-all group"
                >
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{cat.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="bg-white dark:bg-cardDark p-4 rounded-md shadow-sm border border-orange-100 dark:border-orange-500/20">
          <div className="flex items-center justify-between border-b pb-4 mb-4 border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Zap className="w-6 h-6 fill-primary" />
                Flash Sale
              </h2>
              <div className="bg-primary text-white px-3 py-1 rounded flex items-center gap-2 font-mono font-bold">
                <span>12</span>:<span>45</span>:<span>30</span>
              </div>
            </div>
            <button className="text-primary font-medium hover:underline text-sm uppercase">Shop More</button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {PRODUCTS.slice(0, 6).map(product => (
              <ProductCard key={`flash-${product.id}`} product={product} />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold dark:text-white">Just For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PRODUCTS.slice(0, visibleCount).map((product, idx) => (
              <ProductCard key={`trending-${product.id}-${idx}`} product={product} />
            ))}
          </div>
          
          {visibleCount < PRODUCTS.length && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-primary/90 dark:text-primary-light dark:border-primary-light dark:hover:text-white dark:hover:border-primary px-12 py-3 rounded-md font-bold transition-all uppercase w-full sm:w-auto shadow-sm hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
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
