import api from './api';

class WishlistService {
  // Get user's wishlist items
  static async getUserWishlist() {
    try {
      const response = await api.get('/wishlists/');
      return response;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  // Add item to wishlist
  static async addToWishlist(productId, size = null, color = null) {
    try {
      const response = await api.post('/wishlists/', {
        product_id: productId,
        size,
        color
      });
      return response;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove item from wishlist
  static async removeFromWishlist(wishlistItemId) {
    try {
      const response = await api.delete(`/wishlists/${wishlistItemId}/`);
      return response;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Update wishlist item
  static async updateWishlistItem(wishlistItemId, updateData) {
    try {
      const response = await api.patch(`/wishlists/${wishlistItemId}/`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      throw error;
    }
  }

  // Clear entire wishlist
  static async clearWishlist() {
    try {
      const response = await api.delete('/wishlists/clear/');
      return response;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  // Check if product is in wishlist
  static async isInWishlist(productId, size = null, color = null) {
    try {
      const response = await api.get('/wishlists/check/', {
        params: {
          product_id: productId,
          size,
          color
        }
      });
      return response.is_in_wishlist;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  // Move wishlist item to cart
  static async moveToCart(wishlistItemId, quantity = 1) {
    try {
      const response = await api.post(`/wishlists/${wishlistItemId}/move-to-cart/`, {
        quantity
      });
      return response;
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  }

  // Get wishlist item by ID
  static async getWishlistItem(wishlistItemId) {
    try {
      const response = await api.get(`/wishlists/${wishlistItemId}/`);
      return response;
    } catch (error) {
      console.error('Error fetching wishlist item:', error);
      throw error;
    }
  }
}

export default WishlistService;