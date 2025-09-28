import React, { createContext, useContext, useState, useEffect } from 'react';
import WishlistService from '../utils/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await WishlistService.getUserWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load wishlist');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId, size = null, color = null) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      setError(null);
      const newItem = await WishlistService.addToWishlist(productId, size, color);
      setWishlistItems(prev => [...prev, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setError('Failed to add item to wishlist');
      throw error;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      setError(null);
      await WishlistService.removeFromWishlist(wishlistItemId);
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove item from wishlist');
      throw error;
    }
  };

  // Move item to cart
  const moveToCart = async (wishlistItemId, quantity = 1) => {
    try {
      setError(null);
      await WishlistService.moveToCart(wishlistItemId, quantity);
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
    } catch (error) {
      console.error('Error moving to cart:', error);
      setError('Failed to move item to cart');
      throw error;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId, size = null, color = null) => {
    return wishlistItems.some(item => 
      item.product_id === productId && 
      item.size === size && 
      item.color === color
    );
  };

  // Get wishlist item count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      setError(null);
      await WishlistService.clearWishlist();
      setWishlistItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      setError('Failed to clear wishlist');
      throw error;
    }
  };

  // Fetch wishlist on auth change
  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;