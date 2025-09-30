import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import cartService from '../utils/cartService';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    APPLY_COUPON: 'APPLY_COUPON',
    REMOVE_COUPON: 'REMOVE_COUPON',
    LOAD_CART: 'LOAD_CART',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_CART_ID: 'SET_CART_ID'
};

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case CART_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case CART_ACTIONS.SET_CART_ID:
            return {
                ...state,
                cartId: action.payload
            };

        case CART_ACTIONS.LOAD_CART:
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null
            };

        case CART_ACTIONS.ADD_ITEM: {
            const existingItem = state.items.find(item => 
                item.product_id === action.payload.product_id && 
                item.selectedColor === action.payload.selectedColor &&
                item.selectedSize === action.payload.selectedSize
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.product_id === action.payload.product_id && 
                        item.selectedColor === action.payload.selectedColor &&
                        item.selectedSize === action.payload.selectedSize
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                };
            }

            return {
                ...state,
                items: [...state.items, action.payload]
            };
        }

        case CART_ACTIONS.REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case CART_ACTIONS.UPDATE_QUANTITY:
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case CART_ACTIONS.CLEAR_CART:
            return {
                ...state,
                items: []
            };

        case CART_ACTIONS.APPLY_COUPON:
            return {
                ...state,
                coupon: action.payload
            };

        case CART_ACTIONS.REMOVE_COUPON:
            return {
                ...state,
                coupon: null
            };

        default:
            return state;
    }
};

// Initial state
const initialState = {
    items: [],
    coupon: null,
    cartId: null,
    loading: false,
    error: null
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Initialize cart on mount
    useEffect(() => {
        initializeCart();
    }, []);

    const initializeCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const cart = await cartService.getOrCreateUserCart();
            dispatch({ type: CART_ACTIONS.SET_CART_ID, payload: cart.id });
            
            const cartItemsResponse = await cartService.getCartItems(cart.id);
            // Handle paginated response - extract the results array from the data property
            const cartItems = cartItemsResponse.data?.results || cartItemsResponse.data || [];
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartItems });
        } catch (error) {
            console.error('Error initializing cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart' });
        }
    };

    // Cart actions
    const addToCart = useCallback(async (product, quantity = 1, selectedColor = null, selectedSize = null) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            
            if (!state.cartId) {
                await initializeCart();
            }

            const cartItem = {
                product_id: product.id,
                quantity: quantity,
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                name: product.name,
                price: product.salePrice || product.price,
                originalPrice: product.price,
                image: product.image,
                brand: product.brand,
                rating: product.rating,
                colors: product.colors,
                sizes: product.sizes
            };

            const addedItem = await cartService.addToCart(state.cartId, cartItem);
            dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: addedItem });
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
            console.error('Error adding to cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to add item to cart' });
        }
    }, [state.cartId]);

    const removeFromCart = useCallback(async (itemId) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            await cartService.removeFromCart(state.cartId, itemId);
            dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
            console.error('Error removing from cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to remove item from cart' });
        }
    }, [state.cartId]);

    const updateQuantity = useCallback(async (itemId, quantity) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const updatedItem = await cartService.updateCartItem(state.cartId, itemId, { quantity });
            dispatch({ 
                type: CART_ACTIONS.UPDATE_QUANTITY, 
                payload: { id: itemId, quantity } 
            });
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
            console.error('Error updating quantity:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to update item quantity' });
        }
    }, [state.cartId]);

    const clearCart = useCallback(async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            await cartService.clearCart(state.cartId);
            dispatch({ type: CART_ACTIONS.CLEAR_CART });
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
            console.error('Error clearing cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to clear cart' });
        }
    }, [state.cartId]);

    const applyCoupon = useCallback((coupon) => {
        dispatch({ type: CART_ACTIONS.APPLY_COUPON, payload: coupon });
    }, []);

    const removeCoupon = useCallback(() => {
        dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
    }, []);

    // Cart calculations
    const getCartItemsCount = useCallback(() => {
        // Ensure state.items is an array before calling reduce
        if (!Array.isArray(state.items)) {
            console.warn('Cart items is not an array:', state.items);
            return 0;
        }
        return state.items.reduce((total, item) => total + item.quantity, 0);
    }, [state.items]);

    const getCartSubtotal = useCallback(() => {
        // Ensure state.items is an array before calling reduce
        if (!Array.isArray(state.items)) {
            console.warn('Cart items is not an array:', state.items);
            return 0;
        }
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [state.items]);

    const getCouponDiscount = useCallback(() => {
        if (!state.coupon) return 0;
        const subtotal = getCartSubtotal();
        
        if (state.coupon.type === 'percentage') {
            return subtotal * (state.coupon.value / 100);
        } else if (state.coupon.type === 'fixed') {
            return Math.min(state.coupon.value, subtotal);
        }
        return 0;
    }, [state.coupon, getCartSubtotal]);

    const getShippingCost = useCallback(() => {
        const subtotal = getCartSubtotal();
        return subtotal >= 100 ? 0 : 15; // Free shipping over $100
    }, [getCartSubtotal]);

    const getTax = useCallback(() => {
        const subtotal = getCartSubtotal();
        const discount = getCouponDiscount();
        return (subtotal - discount) * 0.08; // 8% tax
    }, [getCartSubtotal, getCouponDiscount]);

    const getCartTotal = useCallback(() => {
        const subtotal = getCartSubtotal();
        const discount = getCouponDiscount();
        const shipping = getShippingCost();
        const tax = getTax();
        return subtotal - discount + shipping + tax;
    }, [getCartSubtotal, getCouponDiscount, getShippingCost, getTax]);

    const isInCart = useCallback((productId, selectedColor = null, selectedSize = null) => {
        return state.items.some(item => 
            item.product_id === productId && 
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );
    }, [state.items]);

    const value = useMemo(() => ({
        // State
        cartItems: state.items,
        coupon: state.coupon,
        cartId: state.cartId,
        loading: state.loading,
        error: state.error,
        
        // Actions
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        
        // Calculations
        getCartItemsCount,
        getCartSubtotal,
        getCouponDiscount,
        getShippingCost,
        getTax,
        getCartTotal,
        isInCart
    }), [
        state.items,
        state.coupon,
        state.cartId,
        state.loading,
        state.error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getCartItemsCount,
        getCartSubtotal,
        getCouponDiscount,
        getShippingCost,
        getTax,
        getCartTotal,
        isInCart
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;