import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Wishlist = () => {
    const { 
        wishlistItems, 
        loading, 
        error, 
        removeFromWishlist, 
        moveToCart, 
        clearWishlist 
    } = useWishlist();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        document.title = 'Wishlist - Fashion Store';
        window.scrollTo(0, 0);
    }, []);

    const handleRemoveFromWishlist = async (itemId) => {
        try {
            setActionLoading(prev => ({ ...prev, [`remove_${itemId}`]: true }));
            await removeFromWishlist(itemId);
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        } finally {
            setActionLoading(prev => ({ ...prev, [`remove_${itemId}`]: false }));
        }
    };

    const handleMoveToCart = async (item) => {
        try {
            setActionLoading(prev => ({ ...prev, [`move_${item.id}`]: true }));
            await moveToCart(item.id, 1);
        } catch (error) {
            console.error('Error moving to cart:', error);
        } finally {
            setActionLoading(prev => ({ ...prev, [`move_${item.id}`]: false }));
        }
    };

    const handleClearWishlist = async () => {
        if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
            try {
                setActionLoading(prev => ({ ...prev, clear: true }));
                await clearWishlist();
            } catch (error) {
                console.error('Error clearing wishlist:', error);
            } finally {
                setActionLoading(prev => ({ ...prev, clear: false }));
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shop__cart__table">
                                <div className="text-center py-5">
                                    <h3>Please Login to View Your Wishlist</h3>
                                    <p className="mb-4">You need to be logged in to access your wishlist.</p>
                                    <Link to="/login" className="primary-btn">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center py-5">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-3">Loading your wishlist...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="alert alert-danger text-center">
                                <h4>Error Loading Wishlist</h4>
                                <p>{error}</p>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Breadcrumb Begin */}
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <span>Wishlist</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Shop Cart Section Begin */}
            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shop__cart__table">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4>My Wishlist ({wishlistItems.length} items)</h4>
                                    {wishlistItems.length > 0 && (
                                        <button 
                                            className="btn btn-outline-danger"
                                            onClick={handleClearWishlist}
                                            disabled={actionLoading.clear}
                                        >
                                            {actionLoading.clear ? 'Clearing...' : 'Clear All'}
                                        </button>
                                    )}
                                </div>

                                {wishlistItems.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fa fa-heart-o" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                                        <h3 className="mt-3">Your Wishlist is Empty</h3>
                                        <p className="mb-4">Add items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
                                        <Link to="/shop" className="primary-btn">Continue Shopping</Link>
                                    </div>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Stock Status</th>
                                                <th>Actions</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wishlistItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="cart__product__item">
                                                        <img 
                                                            src={item.product?.image_url || '/placeholder-image.jpg'} 
                                                            alt={item.product?.name}
                                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                        />
                                                        <div className="cart__product__item__title">
                                                            <h6>
                                                                <Link to={`/product/${item.product?.id}`}>
                                                                    {item.product?.name}
                                                                </Link>
                                                            </h6>
                                                            <div className="rating">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <i 
                                                                        key={i} 
                                                                        className={`fa fa-star${i < (item.product?.rating || 0) ? '' : '-o'}`}
                                                                    ></i>
                                                                ))}
                                                            </div>
                                                            {(item.size || item.color) && (
                                                                <div className="cart__product__item__variant">
                                                                    {item.size && <span>Size: {item.size}</span>}
                                                                    {item.color && <span>Color: {item.color}</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="cart__price">
                                                        ${item.product?.price?.toFixed(2)}
                                                    </td>
                                                    <td className="cart__stock">
                                                        <span className={`stock-status ${item.product?.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                            {item.product?.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="cart__btn">
                                                        <button 
                                                            className="primary-btn cart-btn"
                                                            onClick={() => handleMoveToCart(item)}
                                                            disabled={
                                                                item.product?.stock_quantity <= 0 || 
                                                                actionLoading[`move_${item.id}`]
                                                            }
                                                        >
                                                            {actionLoading[`move_${item.id}`] ? 'Adding...' : 'Add to Cart'}
                                                        </button>
                                                    </td>
                                                    <td className="cart__close">
                                                        <button 
                                                            onClick={() => handleRemoveFromWishlist(item.id)}
                                                            disabled={actionLoading[`remove_${item.id}`]}
                                                            className="btn-close"
                                                        >
                                                            <span className="icon_close"></span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {wishlistItems.length > 0 && (
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="cart__btn">
                                    <Link to="/shop" className="primary-btn">Continue Shopping</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {/* Shop Cart Section End */}
        </>
    );
};

export default Wishlist;