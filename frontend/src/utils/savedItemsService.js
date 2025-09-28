import api from './api';

const SavedItemsService = {
  // Get user's saved items
  getUserSavedItems: async () => {
    try {
      const response = await api.get('/saved-items/');
      return response.data.results || response.data || [];
    } catch (error) {
      console.error('Error fetching saved items:', error);
      throw error.response?.data || { message: 'Failed to fetch saved items' };
    }
  },

  // Add item to saved items
  addToSavedItems: async (productData) => {
    try {
      const payload = {
        product_id: productData.id,
        product_name: productData.name,
        product_price: productData.price,
        product_image: productData.image,
        product_slug: productData.slug,
        size: productData.size || null,
        color: productData.color || null,
        notes: productData.notes || null // For user notes/inspiration
      };
      
      const response = await api.post('/saved-items/', payload);
      return response.data;
    } catch (error) {
      console.error('Error adding to saved items:', error);
      throw error.response?.data || { message: 'Failed to add to saved items' };
    }
  },

  // Remove item from saved items
  removeFromSavedItems: async (itemId) => {
    try {
      const response = await api.delete(`/saved-items/${itemId}/`);
      return response.data;
    } catch (error) {
      console.error('Error removing from saved items:', error);
      throw error.response?.data || { message: 'Failed to remove from saved items' };
    }
  },

  // Update saved item (e.g., add notes)
  updateSavedItem: async (itemId, updateData) => {
    try {
      const response = await api.patch(`/saved-items/${itemId}/`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating saved item:', error);
      throw error.response?.data || { message: 'Failed to update saved item' };
    }
  },

  // Move saved item to wishlist
  moveToWishlist: async (itemId) => {
    try {
      const response = await api.post(`/saved-items/${itemId}/move-to-wishlist/`);
      return response.data;
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      throw error.response?.data || { message: 'Failed to move to wishlist' };
    }
  },

  // Move saved item to cart
  moveToCart: async (itemId, quantity = 1) => {
    try {
      const response = await api.post(`/saved-items/${itemId}/move-to-cart/`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error.response?.data || { message: 'Failed to move to cart' };
    }
  },

  // Clear all saved items
  clearSavedItems: async () => {
    try {
      const response = await api.delete('/saved-items/clear/');
      return response.data;
    } catch (error) {
      console.error('Error clearing saved items:', error);
      throw error.response?.data || { message: 'Failed to clear saved items' };
    }
  }
};

export default SavedItemsService;