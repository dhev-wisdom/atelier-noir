import api from './api';

const OrderService = {
    // Create a new order
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders/', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Get all orders for the current user
    getUserOrders: async () => {
        try {
            const response = await api.get('/orders/');
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },

    // Get a specific order by ID
    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.patch(`/orders/${orderId}/`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Cancel an order
    cancelOrder: async (orderId) => {
        try {
            const response = await api.patch(`/orders/${orderId}/`, { status: 'cancelled' });
            return response.data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    },

    // Get order items for a specific order
    getOrderItems: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/items/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order items:', error);
            throw error;
        }
    },

    // Create order from cart
    createOrderFromCart: async (cartId, shippingAddress, paymentMethod, couponCode = null) => {
        try {
            const orderData = {
                cart_id: cartId,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                coupon_code: couponCode
            };
            const response = await api.post('/orders/from-cart/', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order from cart:', error);
            throw error;
        }
    },

    // Process payment for an order
    processPayment: async (orderId, paymentData) => {
        try {
            const response = await api.post(`/orders/${orderId}/payment/`, paymentData);
            return response.data;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    },

    // Get order tracking information
    getOrderTracking: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/tracking/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order tracking:', error);
            throw error;
        }
    },

    // Calculate order totals
    calculateOrderTotals: async (cartId, shippingAddress, couponCode = null) => {
        try {
            const response = await api.post('/orders/calculate-totals/', {
                cart_id: cartId,
                shipping_address: shippingAddress,
                coupon_code: couponCode
            });
            return response.data;
        } catch (error) {
            console.error('Error calculating order totals:', error);
            throw error;
        }
    }
};

export default OrderService;