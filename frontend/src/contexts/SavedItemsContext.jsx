import React, { createContext, useContext, useState, useEffect } from 'react';
import SavedItemsService from '../utils/savedItemsService';
import { useAuth } from './AuthContext';

const SavedItemsContext = createContext();

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};

export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch saved items
  const fetchSavedItems = async () => {
    if (!isAuthenticated) {
      setSavedItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await SavedItemsService.getUserSavedItems();
      setSavedItems(items);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      setError('Failed to load saved items');
      setSavedItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add product to saved items
  const addToSavedItems = async (product) => {
    if (!isAuthenticated) {
      throw new Error('Please login to save items');
    }

    try {
      const savedItem = await SavedItemsService.addToSavedItems(product);
      setSavedItems(prev => [...prev, savedItem]);
      return savedItem;
    } catch (error) {
      console.error('Error adding to saved items:', error);
      throw error;
    }
  };

  // Remove item from saved items
  const removeFromSavedItems = async (itemId) => {
    try {
      await SavedItemsService.removeFromSavedItems(itemId);
      setSavedItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from saved items:', error);
      throw error;
    }
  };

  // Update saved item (e.g., add notes)
  const updateSavedItem = async (itemId, updateData) => {
    try {
      const updatedItem = await SavedItemsService.updateSavedItem(itemId, updateData);
      setSavedItems(prev => 
        prev.map(item => item.id === itemId ? updatedItem : item)
      );
      return updatedItem;
    } catch (error) {
      console.error('Error updating saved item:', error);
      throw error;
    }
  };

  // Move saved item to wishlist
  const moveToWishlist = async (itemId) => {
    try {
      await SavedItemsService.moveToWishlist(itemId);
      setSavedItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      throw error;
    }
  };

  // Move saved item to cart
  const moveToCart = async (itemId, quantity = 1) => {
    try {
      await SavedItemsService.moveToCart(itemId, quantity);
      setSavedItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  };

  // Clear all saved items
  const clearSavedItems = async () => {
    try {
      await SavedItemsService.clearSavedItems();
      setSavedItems([]);
    } catch (error) {
      console.error('Error clearing saved items:', error);
      throw error;
    }
  };

  // Check if product is in saved items
  const isInSavedItems = (productId, size = null, color = null) => {
    return savedItems.some(item => 
      item.product_id === productId && 
      item.size === size && 
      item.color === color
    );
  };

  // Get saved items count
  const getSavedItemsCount = () => {
    return savedItems.length;
  };

  // Fetch saved items on auth change
  useEffect(() => {
    fetchSavedItems();
  }, [isAuthenticated]);

  const value = {
    savedItems,
    loading,
    error,
    addToSavedItems,
    removeFromSavedItems,
    updateSavedItem,
    moveToWishlist,
    moveToCart,
    isInSavedItems,
    getSavedItemsCount,
    clearSavedItems,
    fetchSavedItems
  };

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export default SavedItemsContext;