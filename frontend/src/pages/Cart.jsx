import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        coupon,
        getCartSubtotal,
        getCouponDiscount,
        getShippingCost,
        getTax,
        getCartTotal,
        getCartItemsCount
    } = useCart();

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Available coupons for demo
    const availableCoupons = {
        'SAVE10': { type: 'percentage', value: 10, description: '10% off' },
        'SAVE20': { type: 'percentage', value: 20, description: '20% off' },
        'FREESHIP': { type: 'fixed', value: 15, description: 'Free shipping' },
        'WELCOME': { type: 'fixed', value: 25, description: '$25 off' }
    };

    useEffect(() => {
        document.title = `Shopping Cart (${getCartItemsCount()}) | Atelier Noir`;
        window.scrollTo(0, 0);
    }, [getCartItemsCount]);

    const handleQuantityChange = (cartId, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(cartId, newQuantity);
        }
    };

    const handleRemoveItem = (cartId) => {
        removeFromCart(cartId);
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        setIsApplyingCoupon(true);
        setCouponError('');

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundCoupon = availableCoupons[couponCode.toUpperCase()];
        if (foundCoupon) {
            applyCoupon({
                code: couponCode.toUpperCase(),
                ...foundCoupon
            });
            setCouponCode('');
        } else {
            setCouponError('Invalid coupon code');
        }
        setIsApplyingCoupon(false);
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponError('');
    };

    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i 
                key={i} 
                className={`fa fa-star${i < rating ? '' : '-o'}`}
                style={{ color: i < rating ? '#f39c12' : '#ddd' }}
            ></i>
        ));
    };

    if (cartItems.length === 0) {
        return (
            <>
                {/* Breadcrumb Begin */}
                <div className="breadcrumb-option" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '60px 0' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__links" style={{ textAlign: 'center' }}>
                                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                                        <i className="fa fa-home"></i> Home
                                    </Link>
                                    <span style={{ color: 'white', margin: '0 10px' }}>/</span>
                                    <span style={{ color: 'white', fontSize: '16px' }}>Shopping Cart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb End */}

                {/* Empty Cart Section */}
                <section className="shop-cart spad" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <div className="container">
                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <div style={{ fontSize: '80px', color: '#ddd', marginBottom: '30px' }}>
                                <i className="fa fa-shopping-cart"></i>
                            </div>
                            <h3 style={{ marginBottom: '20px', color: '#333' }}>Your cart is empty</h3>
                            <p style={{ color: '#666', marginBottom: '40px', fontSize: '16px' }}>
                                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                            </p>
                            <Link 
                                to="/shop" 
                                className="primary-btn"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    padding: '15px 40px',
                                    borderRadius: '25px',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    display: 'inline-block'
                                }}
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            {/* Breadcrumb Begin */}
            <div className="breadcrumb-option" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '60px 0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links" style={{ textAlign: 'center' }}>
                                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                                    <i className="fa fa-home"></i> Home
                                </Link>
                                <span style={{ color: 'white', margin: '0 10px' }}>/</span>
                                <span style={{ color: 'white', fontSize: '16px' }}>Shopping Cart ({getCartItemsCount()} items)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Shop Cart Section Begin */}
            <section className="shop-cart spad" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shop__cart__table" style={{ 
                                background: 'white', 
                                borderRadius: '15px', 
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                marginBottom: '40px'
                            }}>
                                <table style={{ width: '100%' }}>
                                    <thead style={{ background: '#f8f9fa' }}>
                                        <tr>
                                            <th style={{ padding: '20px', fontWeight: '600', color: '#333' }}>Product</th>
                                            <th style={{ padding: '20px', fontWeight: '600', color: '#333' }}>Price</th>
                                            <th style={{ padding: '20px', fontWeight: '600', color: '#333' }}>Quantity</th>
                                            <th style={{ padding: '20px', fontWeight: '600', color: '#333' }}>Total</th>
                                            <th style={{ padding: '20px', fontWeight: '600', color: '#333' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.cartId} style={{ borderBottom: '1px solid #eee' }}>
                                                <td className="cart__product__item" style={{ padding: '25px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            style={{ 
                                                                width: '80px', 
                                                                height: '80px', 
                                                                objectFit: 'cover',
                                                                borderRadius: '10px',
                                                                marginRight: '20px'
                                                            }}
                                                        />
                                                        <div>
                                                            <h6 style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#333' }}>
                                                                {item.name}
                                                            </h6>
                                                            {item.selectedColor && (
                                                                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                                                    Color: {item.selectedColor}
                                                                </p>
                                                            )}
                                                            {item.selectedSize && (
                                                                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                                                    Size: {item.selectedSize}
                                                                </p>
                                                            )}
                                                            {item.brand && (
                                                                <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                                                                    {item.brand}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="cart__price" style={{ padding: '25px 20px' }}>
                                                    <div>
                                                        <span style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <div style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                                                                {formatPrice(item.originalPrice)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="cart__quantity" style={{ padding: '25px 20px' }}>
                                                    <div className="pro-qty" style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        background: '#f8f9fa',
                                                        borderRadius: '25px',
                                                        padding: '5px',
                                                        width: 'fit-content'
                                                    }}>
                                                        <span 
                                                            className="dec qtybtn" 
                                                            onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                padding: '8px 12px',
                                                                borderRadius: '50%',
                                                                background: item.quantity > 1 ? '#667eea' : '#ddd',
                                                                color: 'white',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >-</span>
                                                        <input 
                                                            type="text" 
                                                            value={item.quantity} 
                                                            readOnly 
                                                            style={{
                                                                border: 'none',
                                                                background: 'transparent',
                                                                textAlign: 'center',
                                                                width: '40px',
                                                                fontWeight: '600',
                                                                color: '#333'
                                                            }}
                                                        />
                                                        <span 
                                                            className="inc qtybtn" 
                                                            onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                padding: '8px 12px',
                                                                borderRadius: '50%',
                                                                background: '#667eea',
                                                                color: 'white',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >+</span>
                                                    </div>
                                                </td>
                                                <td className="cart__total" style={{ padding: '25px 20px' }}>
                                                    <span style={{ fontWeight: '700', color: '#333', fontSize: '18px' }}>
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </td>
                                                <td className="cart__close" style={{ padding: '25px 20px' }}>
                                                    <span 
                                                        className="icon_close" 
                                                        onClick={() => handleRemoveItem(item.cartId)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: '#dc3545',
                                                            fontSize: '18px',
                                                            padding: '10px',
                                                            borderRadius: '50%',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.background = '#dc354520'}
                                                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                    ></span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Cart Actions */}
                    <div className="row" style={{ marginBottom: '40px' }}>
                        <div className="col-lg-6 col-md-6">
                            <div className="cart__btn">
                                <Link 
                                    to="/shop"
                                    style={{
                                        background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                                        color: 'white',
                                        padding: '12px 30px',
                                        borderRadius: '25px',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        display: 'inline-block'
                                    }}
                                >
                                    <i className="fa fa-arrow-left" style={{ marginRight: '8px' }}></i>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6" style={{ textAlign: 'right' }}>
                            <button
                                onClick={clearCart}
                                style={{
                                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                    color: 'white',
                                    padding: '12px 30px',
                                    borderRadius: '25px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="fa fa-trash" style={{ marginRight: '8px' }}></i>
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Coupon and Total Section */}
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="discount__content" style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '15px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}>
                                <h6 style={{ marginBottom: '20px', fontWeight: '600', color: '#333' }}>
                                    Discount Codes
                                </h6>
                                
                                {coupon && (
                                    <div style={{
                                        background: '#d4edda',
                                        border: '1px solid #c3e6cb',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong style={{ color: '#155724' }}>{coupon.code}</strong>
                                            <span style={{ color: '#155724', marginLeft: '10px' }}>
                                                ({coupon.description})
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#dc3545',
                                                cursor: 'pointer',
                                                fontSize: '16px'
                                            }}
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleCouponSubmit}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={isApplyingCoupon || coupon}
                                            style={{
                                                flex: 1,
                                                padding: '12px 15px',
                                                border: '2px solid #eee',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={isApplyingCoupon || !couponCode.trim() || coupon}
                                            style={{
                                                background: isApplyingCoupon || coupon ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 25px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: isApplyingCoupon || coupon ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {isApplyingCoupon ? 'Applying...' : 'Apply'}
                                        </button>
                                    </div>
                                </form>

                                {couponError && (
                                    <div style={{
                                        color: '#dc3545',
                                        fontSize: '14px',
                                        marginTop: '10px',
                                        padding: '10px',
                                        background: '#f8d7da',
                                        border: '1px solid #f5c6cb',
                                        borderRadius: '5px'
                                    }}>
                                        {couponError}
                                    </div>
                                )}

                                <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                                    <p style={{ margin: '5px 0' }}>Try these codes:</p>
                                    <p style={{ margin: '0' }}>SAVE10, SAVE20, FREESHIP, WELCOME</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 offset-lg-2">
                            <div className="cart__total__procced" style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '15px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}>
                                <h6 style={{ marginBottom: '25px', fontWeight: '600', color: '#333', fontSize: '18px' }}>
                                    Order Summary
                                </h6>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        padding: '10px 0',
                                        borderBottom: '1px solid #eee',
                                        fontSize: '15px'
                                    }}>
                                        <span>Subtotal ({getCartItemsCount()} items)</span>
                                        <span style={{ fontWeight: '600' }}>{formatPrice(getCartSubtotal())}</span>
                                    </li>
                                    
                                    {coupon && (
                                        <li style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            padding: '10px 0',
                                            borderBottom: '1px solid #eee',
                                            fontSize: '15px',
                                            color: '#28a745'
                                        }}>
                                            <span>Discount ({coupon.code})</span>
                                            <span style={{ fontWeight: '600' }}>-{formatPrice(getCouponDiscount())}</span>
                                        </li>
                                    )}
                                    
                                    <li style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        padding: '10px 0',
                                        borderBottom: '1px solid #eee',
                                        fontSize: '15px'
                                    }}>
                                        <span>Shipping</span>
                                        <span style={{ fontWeight: '600', color: getShippingCost() === 0 ? '#28a745' : '#333' }}>
                                            {getShippingCost() === 0 ? 'FREE' : formatPrice(getShippingCost())}
                                        </span>
                                    </li>
                                    
                                    <li style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        padding: '10px 0',
                                        borderBottom: '2px solid #eee',
                                        fontSize: '15px'
                                    }}>
                                        <span>Tax</span>
                                        <span style={{ fontWeight: '600' }}>{formatPrice(getTax())}</span>
                                    </li>
                                    
                                    <li style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        padding: '20px 0 0 0',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#333'
                                    }}>
                                        <span>Total</span>
                                        <span>{formatPrice(getCartTotal())}</span>
                                    </li>
                                </ul>
                                
                                {getShippingCost() > 0 && (
                                    <div style={{
                                        background: '#fff3cd',
                                        border: '1px solid #ffeaa7',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        margin: '20px 0',
                                        fontSize: '14px',
                                        color: '#856404'
                                    }}>
                                        <i className="fa fa-info-circle" style={{ marginRight: '8px' }}></i>
                                        Add {formatPrice(100 - getCartSubtotal())} more for free shipping!
                                    </div>
                                )}
                                
                                <Link 
                                    to="/checkout" 
                                    className="primary-btn"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        padding: '15px 0',
                                        borderRadius: '25px',
                                        textDecoration: 'none',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        display: 'block',
                                        marginTop: '25px',
                                        transition: 'all 0.3s ease',
                                        border: 'none'
                                    }}
                                >
                                    <i className="fa fa-lock" style={{ marginRight: '8px' }}></i>
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Shop Cart Section End */}
        </>
    );
};

export default Cart;