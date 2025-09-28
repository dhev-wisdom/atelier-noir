import api from './api';

class WishlistService {
  // Get user's wishlist items
  static async getUserWishlist() {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  // Add item to wishlist
  static async addToWishlist(productId, size = null, color = null) {
    try {
      const response = await api.post('/wishlist', {
        product_id: productId,
        size,
        color
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove item from wishlist
  static async removeFromWishlist(wishlistItemId) {
    try {
      const response = await api.delete(`/wishlist/${wishlistItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Move item from wishlist to cart
  static async moveToCart(wishlistItemId, quantity = 1) {
    try {
      const response = await api.post(`/wishlist/${wishlistItemId}/move-to-cart`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  }

  // Check if product is in wishlist
  static async isInWishlist(productId, size = null, color = null) {
    try {
      const response = await api.get('/wishlist/check', {
        params: {
          product_id: productId,
          size,
          color
        }
      });
      return response.data.is_in_wishlist;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  // Clear entire wishlist
  static async clearWishlist() {
    try {
      const response = await api.delete('/wishlist/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  // Get wishlist item count
  static async getWishlistCount() {
    try {
      const response = await api.get('/wishlist/count');
      return response.data.count;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }
}

export default WishlistService;