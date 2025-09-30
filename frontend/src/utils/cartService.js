import api from './api';

// Cart API service
class CartService {
    // Get all carts for the authenticated user
    async getCarts() {
        try {
            const response = await api.get('/carts/');
            return response;
        } catch (error) {
            console.error('Error fetching carts:', error);
            throw error;
        }
    }

    // Create a new cart
    async createCart(cartData = {}) {
        try {
            const response = await api.post('/carts/', cartData);
            return response;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw error;
        }
    }

    // Get a specific cart by ID
    async getCart(cartId) {
        try {
            const response = await api.get(`/carts/${cartId}/`);
            return response;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    // Update a specific cart
    async updateCart(cartId, cartData) {
        try {
            const response = await api.put(`/carts/${cartId}/`, cartData);
            return response;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }

    // Delete a specific cart
    async deleteCart(cartId) {
        try {
            const response = await api.delete(`/carts/${cartId}/`);
            return response;
        } catch (error) {
            console.error('Error deleting cart:', error);
            throw error;
        }
    }

    // Get items in a specific cart
    async getCartItems(cartId) {
        try {
            const response = await api.get(`/carts/${cartId}/items/`);
            return response;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }

    // Add item to a specific cart
    async addCartItem(cartId, itemData) {
        try {
            const response = await api.post(`/carts/${cartId}/items/`, itemData);
            return response;
        } catch (error) {
            console.error('Error adding cart item:', error);
            throw error;
        }
    }

    // Get a specific cart item
    async getCartItem(cartId, itemId) {
        try {
            const response = await api.get(`/carts/${cartId}/items/${itemId}/`);
            return response;
        } catch (error) {
            console.error('Error fetching cart item:', error);
            throw error;
        }
    }

    // Update a specific cart item (quantity, etc.)
    async updateCartItem(cartId, itemId, itemData) {
        try {
            const response = await api.put(`/carts/${cartId}/items/${itemId}/`, itemData);
            return response;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }

    // Delete a specific cart item
    async deleteCartItem(cartId, itemId) {
        try {
            const response = await api.delete(`/carts/${cartId}/items/${itemId}/`);
            return response;
        } catch (error) {
            console.error('Error deleting cart item:', error);
            throw error;
        }
    }

    // Clear all items from a cart
    async clearCart(cartId) {
        try {
            const response = await api.delete(`/carts/${cartId}/clear/`);
            return response;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    // Get cart totals
    async getCartTotals(cartId) {
        try {
            const response = await api.get(`/carts/${cartId}/totals/`);
            return response;
        } catch (error) {
            console.error('Error fetching cart totals:', error);
            throw error;
        }
    }

    // Get or create user's active cart
    async getOrCreateUserCart() {
        try {
            // First try to get existing carts
            const cartsResponse = await this.getCarts();
            console.log('Carts API response:', cartsResponse);
            
            // Handle paginated response - extract results array from response.data
            const carts = cartsResponse.data?.results || cartsResponse.data || [];
            
            // Find an active cart or use the first one
            let activeCart = carts.find(cart => cart.status === 'active') || carts[0];
            
            // If no cart exists, create one
            if (!activeCart) {
                activeCart = await this.createCart();
            }
            
            return activeCart;
        } catch (error) {
            console.error('Error getting or creating user cart:', error);
            throw error;
        }
    }
}

export default new CartService();