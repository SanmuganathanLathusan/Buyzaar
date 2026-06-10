import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    const productId = product._id || product.id;
    const exists = wishlistItems.some((item) => item._id === productId || item.id === productId);
    
    if (exists) {
      toast.error('Already in wishlist');
      return;
    }

    setWishlistItems((prev) => [...prev, product]);
    toast.success('Added to wishlist');
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id !== productId && item.id !== productId)));
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId || item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    const id = product._id || product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      toggleWishlist,
      wishlistCount 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
