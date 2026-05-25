import React, { useState, useEffect, useMemo } from 'react';
import { Filter, ChevronDown, Frown, SlidersHorizontal, X, Search, Tag, LayoutGrid } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES, CATEGORY_HIERARCHY, MAIN_CATEGORY_MAP } from '../data/products';
import { apiFetch } from '../utils/api';

const SORT_OPTIONS = [
  { label: 'Best Match',        value: 'best' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',         value: 'rating' },
];

const CATEGORY_EMOJIS = {
  'Fashion Collection': '👗',
  'Electronics Item':   '💻',
  'Home Appliance':     '🏠',
  'Kitchen Item':       '🍳',
  'Furniture':          '🛋️',
  'Food':               '🍔',
  'Gadgets':            '📱',
  'Toys and Games':     '🎮',
  'Health & beauty':    '💄',
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange]     = useState(500000);
  const [sortBy, setSortBy]             = useState('best');
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeSubCat, setActiveSubCat]           = useState('');

  // ── NEW: active search-category tab ──
  const [searchCatTab, setSearchCatTab] = useState('__all__');

  const searchQuery   = searchParams.get('search')   || '';
  const categoryQuery = searchParams.get('category') || '';

  // Derived: is this a top-level grouped category or a leaf?
  const isMainCategory = Boolean(MAIN_CATEGORY_MAP[categoryQuery]);
  const subCategories  = isMainCategory ? MAIN_CATEGORY_MAP[categoryQuery] : [];

  // Reset drill-down chip when main category changes
  useEffect(() => { setActiveSubCat(''); }, [categoryQuery]);

  // Reset search-category tab whenever search query changes
  useEffect(() => { setSearchCatTab('__all__'); }, [searchQuery]);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Resolve which sub-categories to fetch INSIDE the effect
        // so we always use the current render's values (no stale closure)
        const mainCats = MAIN_CATEGORY_MAP[categoryQuery] || [];
        const isMain   = mainCats.length > 0;

        const params = new URLSearchParams();
        if (searchQuery) params.set('keyword', searchQuery);

        if (activeSubCat) {
          // Drilled into a specific chip → single category
          params.set('category', activeSubCat);
        } else if (isMain) {
          // Main category → pass each sub-category as a separate cat[] param
          // e.g. cat[]=Fashion Collection&cat[]=Watches&cat[]=Health & beauty
          // Express/qs parses repeated params as an array, no encoding issues
          mainCats.forEach((c) => params.append('cat[]', c));
        } else if (categoryQuery) {
          // Direct leaf/sub-category link
          params.set('category', categoryQuery);
        }

        const url = `/api/products?${params.toString()}`;
        const response = await apiFetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts(STATIC_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryQuery, activeSubCat]);

  const handleCategoryToggle = (name) => {
    const p = new URLSearchParams(searchParams);
    if (categoryQuery === name) p.delete('category');
    else p.set('category', name);
    setSearchParams(p);
  };

  // ── Search category tabs: derive unique categories from all search results ──
  const searchCategoryTabs = useMemo(() => {
    if (!searchQuery) return [];
    const map = {};
    products.forEach((p) => {
      const cat = p.category || 'Other';
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])   // most products first
      .map(([name, count]) => ({ name, count }));
  }, [products, searchQuery]);

  // Auto-select first tab when tabs change (new search result arrives)
  useEffect(() => {
    if (searchCategoryTabs.length > 0 && searchCatTab === '__all__') {
      // keep '__all__' as default — user can still see everything
    }
  }, [searchCategoryTabs]);

  const filteredProducts = useMemo(() => {
    let arr = products.filter((p) => {
      if (priceRange !== 500000 && p.price > priceRange) return false;
      // If searching and a specific tab is chosen, filter by that category
      if (searchQuery && searchCatTab !== '__all__' && p.category !== searchCatTab) return false;
      return true;
    });
    if (sortBy === 'price_asc')  arr = [...arr].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') arr = [...arr].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     arr = [...arr].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return arr;
  }, [products, priceRange, sortBy, searchQuery, searchCatTab]);

  /* ── Sidebar content (shared between desktop & mobile) ── */
  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-secondary dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Filters
        </div>
        {(categoryQuery || priceRange !== 500000) && (
          <button
            onClick={() => { setSearchParams(new URLSearchParams()); setPriceRange(500000); }}
            className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Categories
        </h3>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <label className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group">
                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  categoryQuery === cat.name
                    ? 'bg-primary border-primary'
                    : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'
                }`}>
                  {categoryQuery === cat.name && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={categoryQuery === cat.name}
                  onChange={() => handleCategoryToggle(cat.name)}
                />
                <span className={`text-sm font-medium transition-colors ${categoryQuery === cat.name ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                  {cat.name}
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
                    {searchQuery && searchCatTab !== '__all__' ? (
                      <span className="ml-1">
                        in <em className="text-primary font-semibold">{CATEGORY_EMOJIS[searchCatTab] || ''} {searchCatTab}</em>
                        {' '}for "<em className="text-primary">{searchQuery}</em>"
                      </span>
                    ) : searchQuery ? (
                      <span className="ml-1">for "<em className="text-primary">{searchQuery}</em>"</span>
                    ) : null}
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
                  {(categoryQuery || priceRange !== 500000) && (
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
            {(categoryQuery || priceRange !== 500000) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                    {categoryQuery}
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('category'); setSearchParams(p); }}>
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

            {/* ══════════════════════════════════════
                SEARCH CATEGORY TABS
                Shown only when a search query is active
            ══════════════════════════════════════ */}
            <AnimatePresence>
              {searchQuery && !isLoading && searchCategoryTabs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="mb-5"
                >
                  <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border dark:border-border-dark">
                      <LayoutGrid className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Results by Category
                      </span>
                      <span className="ml-auto text-[10px] font-semibold text-slate-400">
                        {searchCategoryTabs.length} categor{searchCategoryTabs.length === 1 ? 'y' : 'ies'} matched
                      </span>
                    </div>

                    {/* Tab pills */}
                    <div className="flex flex-wrap gap-2 px-4 py-3">
                      {/* "All" tab */}
                      <button
                        onClick={() => setSearchCatTab('__all__')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          searchCatTab === '__all__'
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                            : 'bg-surface-muted dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border dark:border-border-dark hover:border-primary hover:text-primary'
                        }`}
                      >
                        All Results
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                          searchCatTab === '__all__'
                            ? 'bg-white/25 text-white'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {products.length}
                        </span>
                      </button>

                      {/* Per-category tabs */}
                      {searchCategoryTabs.map(({ name, count }, idx) => (
                        <motion.button
                          key={name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05, duration: 0.2 }}
                          onClick={() => setSearchCatTab(name)}
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            searchCatTab === name
                              ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                              : 'bg-surface-muted dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border dark:border-border-dark hover:border-primary hover:text-primary'
                          }`}
                        >
                          <span className="text-sm leading-none">{CATEGORY_EMOJIS[name] || '🏷️'}</span>
                          {name}
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                            searchCatTab === name
                              ? 'bg-white/25 text-white'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {count}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Sub-category chip strip (shown only for main categories, no search) ── */}
            <AnimatePresence>
              {!searchQuery && isMainCategory && subCategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mb-5"
                >
                  <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card px-4 py-3">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Tag className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Browse by Sub-Category
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveSubCat('')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          activeSubCat === ''
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                            : 'bg-surface-muted dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border dark:border-border-dark hover:border-primary hover:text-primary'
                        }`}
                      >
                        All {categoryQuery}
                      </button>
                      {subCategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setActiveSubCat(activeSubCat === sub ? '' : sub)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            activeSubCat === sub
                              ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                              : 'bg-surface-muted dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border dark:border-border-dark hover:border-primary hover:text-primary'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
