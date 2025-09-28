import api from './api';

// Cart API service
class CartService {
    // Get all carts for the authenticated user
    async getCarts() {
        try {
            const response = await api.get('/carts/');
            return response.data;
        } catch (error) {
            console.error('Error fetching carts:', error);
            throw error;
        }
    }

    // Create a new cart (empty body defaults to authenticated user)
    async createCart(userData = {}) {
        try {
            const response = await api.post('/carts/', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw error;
        }
    }

    // Get a specific cart by ID
    async getCart(cartId) {
        try {
            const response = await api.get(`/carts/${cartId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    // Update a specific cart
    async updateCart(cartId, cartData) {
        try {
            const response = await api.put(`/carts/${cartId}/`, cartData);
            return response.data;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }

    // Delete a specific cart
    async deleteCart(cartId) {
        try {
            const response = await api.delete(`/carts/${cartId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting cart:', error);
            throw error;
        }
    }

    // Get items in a specific cart
    async getCartItems(cartId) {
        try {
            const response = await api.get(`/carts/${cartId}/items/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }

    // Add item to cart
    async addItemToCart(cartId, itemData) {
        try {
            const response = await api.post(`/carts/${cartId}/items/`, itemData);
            return response.data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    }

    // Get a specific cart item
    async getCartItem(cartId, itemId) {
        try {
            const response = await api.get(`/carts/${cartId}/items/${itemId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart item:', error);
            throw error;
        }
    }

    // Update a specific cart item (quantity, etc.)
    async updateCartItem(cartId, itemId, itemData) {
        try {
            const response = await api.put(`/carts/${cartId}/items/${itemId}/`, itemData);
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }

    // Remove a specific cart item
    async removeCartItem(cartId, itemId) {
        try {
            const response = await api.delete(`/carts/${cartId}/items/${itemId}/`);
            return response.data;
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    }

    // Clear all items from cart
    async clearCart(cartId) {
        try {
            // Get all items first
            const items = await this.getCartItems(cartId);
            
            // Remove each item
            const deletePromises = items.map(item => 
                this.removeCartItem(cartId, item.id)
            );
            
            await Promise.all(deletePromises);
            return { success: true, message: 'Cart cleared successfully' };
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    // Get or create user's active cart
    async getOrCreateUserCart() {
        try {
            // First try to get existing carts
            const cartsResponse = await this.getCarts();
            console.log('Carts API response:', cartsResponse);
            
            // Handle paginated response - extract results array
            const carts = cartsResponse.results || cartsResponse || [];
            
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