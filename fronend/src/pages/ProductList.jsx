import React, { useState, useEffect, useMemo } from 'react';
import { Filter, ChevronDown, Frown, SlidersHorizontal, X, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES, CATEGORY_HIERARCHY } from '../data/products';
import { apiFetch } from '../utils/api';

const SORT_OPTIONS = [
  { label: 'Best Match',    value: 'best' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',    value: 'rating' },
];

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange]     = useState(500000);
  const [sortBy, setSortBy]             = useState('best');
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

  const searchQuery     = searchParams.get('search')      || '';
  const categoryQuery   = searchParams.get('category')    || '';
  const subcategoryQuery= searchParams.get('subcategory') || '';

  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let url = '/api/products?';
        if (searchQuery)      url += `keyword=${encodeURIComponent(searchQuery)}&`;
        if (subcategoryQuery) url += `category=${encodeURIComponent(subcategoryQuery)}&`;
        else if (categoryQuery) url += `category=${encodeURIComponent(categoryQuery)}&`;

        const response = await apiFetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryQuery, subcategoryQuery]);

  const handleCategoryToggle = (name) => {
    const p = new URLSearchParams(searchParams);
    if (subcategoryQuery === name) p.delete('subcategory');
    else p.set('subcategory', name);
    setSearchParams(p);
  };

  let currentSubcategories = CATEGORIES.map((c) => c.name);
  if (categoryQuery && CATEGORY_HIERARCHY[categoryQuery]) {
    currentSubcategories = CATEGORY_HIERARCHY[categoryQuery];
  }

  const filteredProducts = useMemo(() => {
    let arr = products.filter((p) => {
      if (priceRange !== 500000 && p.price > priceRange) return false;
      return true;
    });
    if (sortBy === 'price_asc')  arr = [...arr].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') arr = [...arr].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     arr = [...arr].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return arr;
  }, [products, priceRange, sortBy]);

  /* ── Sidebar content (shared between desktop & mobile) ── */
  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-secondary dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Filters
        </div>
        {(subcategoryQuery || priceRange !== 500000) && (
          <button
            onClick={() => { setSearchParams(new URLSearchParams()); setPriceRange(500000); }}
            className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category / subcategory filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          {categoryQuery ? 'Subcategories' : 'Categories'}
        </h3>
        <ul className="space-y-1">
          {currentSubcategories.map((name, idx) => (
            <li key={idx}>
              <label className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group">
                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  subcategoryQuery === name
                    ? 'bg-primary border-primary'
                    : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'
                }`}>
                  {subcategoryQuery === name && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={subcategoryQuery === name}
                  onChange={() => handleCategoryToggle(name)}
                />
                <span className={`text-sm font-medium transition-colors ${subcategoryQuery === name ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                  {name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border dark:border-border-dark" />

      {/* Price range */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-surface-muted dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-border dark:border-border-dark">
              Rs. 0
            </span>
            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold border border-primary/20">
              Rs. {Number(priceRange).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-container py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-5 flex-wrap">
          <a href="/" className="hover:text-primary transition-colors font-medium">Home</a>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          {categoryQuery ? (
            <>
              <span className="text-secondary dark:text-white font-medium">{categoryQuery}</span>
              {subcategoryQuery && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <span className="text-secondary dark:text-white font-medium">{subcategoryQuery}</span>
                </>
              )}
            </>
          ) : searchQuery ? (
            <span className="text-secondary dark:text-white font-medium">Search: "{searchQuery}"</span>
          ) : (
            <span className="text-secondary dark:text-white font-medium">All Products</span>
          )}
        </nav>

        <div className="flex gap-6">

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card p-5">
              <SidebarContent />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card px-5 py-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {isLoading ? 'Loading…' : (
                  <span>
                    <span className="font-bold text-secondary dark:text-white text-base">{filteredProducts.length}</span>
                    {' '}products found
                    {searchQuery && <span className="ml-1">for "<em className="text-primary">{searchQuery}</em>"</span>}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-border dark:border-border-dark text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(subcategoryQuery || priceRange !== 500000) && (
                    <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">!</span>
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 font-medium hidden sm:block">Sort:</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-secondary dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      >
                        {SORT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {(subcategoryQuery || priceRange !== 500000) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {subcategoryQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                    {subcategoryQuery}
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('subcategory'); setSearchParams(p); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRange !== 500000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    ≤ Rs. {priceRange.toLocaleString()}
                    <button onClick={() => setPriceRange(500000)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id || product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                  <Frown className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-secondary dark:text-white mb-2">No products found</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                  Try adjusting your search term, filters, or browse another category.
                </p>
                <button
                  onClick={() => { setSearchParams(new URLSearchParams()); setPriceRange(500000); }}
                  className="btn-primary btn-md"
                >
                  <Search className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-white dark:bg-slate-900 z-50 p-5 overflow-y-auto shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-secondary dark:text-white text-lg">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-primary btn-lg w-full mt-6"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
