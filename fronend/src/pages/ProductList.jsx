import React, { useState, useEffect, useMemo } from 'react';
import { Filter, ChevronDown, Frown } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES } from '../data/products';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState(500000);
  
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  
  const [products, setProducts] = useState(STATIC_PRODUCTS); // Fallback to static, but will fetch below
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let url = '/api/products?';
        if (searchQuery) url += `keyword=${encodeURIComponent(searchQuery)}&`;
        if (categoryQuery) url += `category=${encodeURIComponent(categoryQuery)}&`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Fetch products error:", err);
        setError(err.message);
        // On error, we just keep the previous state (or fallback static data)
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryQuery]);

  const handleCategoryToggle = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryQuery === categoryName) {
      newParams.delete('category'); // Toggle off
    } else {
      newParams.set('category', categoryName); // Toggle on
    }
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Backend handles search/category, we just handle price filtering locally
      if (priceRange !== 500000 && product.price > priceRange) {
        return false;
      }
      return true;
    });
  }, [products, priceRange]);

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          Home &gt; {categoryQuery ? <span className="text-gray-900 dark:text-white font-medium">{categoryQuery}</span> : 'All Products'} {searchQuery && `> Search: "${searchQuery}"`}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-cardDark p-4 rounded-sm border border-gray-100 dark:border-gray-800 h-fit space-y-6">
            <div className="flex items-center gap-2 mb-2 font-bold text-lg dark:text-white">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-3 dark:text-gray-200">Category</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {CATEGORIES.map(cat => (
                  <li key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input 
                      type="checkbox" 
                      className="accent-primary" 
                      checked={categoryQuery === cat.name}
                      onChange={() => handleCategoryToggle(cat.name)}
                    /> 
                    <span onClick={() => handleCategoryToggle(cat.name)}>{cat.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="dark:border-gray-700" />

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-3 dark:text-gray-200">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="500000" 
                step="5000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary" 
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Rs. 0</span>
                <span>Rs. {Number(priceRange).toLocaleString()}</span>
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold mb-3 dark:text-gray-200">Rating</h3>
              {[4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center gap-2 mb-2 cursor-pointer hover:text-primary text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="accent-primary" />
                  <div className="flex text-yellow-400">
                    {'★'.repeat(stars)}{'☆'.repeat(5-stars)}
                  </div>
                  <span>& Up</span>
                </div>
              ))}
            </div>

          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-cardDark p-4 rounded-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col sm:flex-row justify-between items-center h-fit">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-0">
                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
                {searchQuery && <span> for "{searchQuery}"</span>}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sort By:</span>
                <button className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded text-gray-800 dark:text-gray-200">
                  Best Match <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Frown className="w-16 h-16 mb-4 text-gray-300" />
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">No products found</h2>
                <p className="mt-2 text-sm">Try adjusting your filters or search query.</p>
              </div>
            )}

            {/* Pagination Placeholder */}
            <div className="mt-8 flex justify-center gap-2 text-sm">
              <button className="hidden sm:block px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Previous</button>
              <button className="px-4 py-2 bg-primary text-white rounded-md font-bold">1</button>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">2</button>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">3</button>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Next</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
