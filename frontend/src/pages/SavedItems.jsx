import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSavedItems } from '../contexts/SavedItemsContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const SavedItems = () => {
    const { 
        savedItems, 
        loading, 
        error, 
        removeFromSavedItems, 
        updateSavedItem,
        moveToCart, 
        moveToWishlist,
        clearSavedItems 
    } = useSavedItems();
    const { addToCart } = useCart();
    const { addToWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const [actionLoading, setActionLoading] = useState({});
    const [editingNotes, setEditingNotes] = useState({});
    const [notes, setNotes] = useState({});

    useEffect(() => {
        document.title = 'Saved Items | Atelier Noir';
        window.scrollTo(0, 0);
    }, []);

    // Initialize notes from saved items
    useEffect(() => {
        const initialNotes = {};
        savedItems.forEach(item => {
            initialNotes[item.id] = item.notes || '';
        });
        setNotes(initialNotes);
    }, [savedItems]);

    const handleRemoveItem = async (itemId) => {
        try {
            setActionLoading(prev => ({ ...prev, [`remove-${itemId}`]: true }));
            await removeFromSavedItems(itemId);
        } catch (error) {
            console.error('Failed to remove item:', error);
            alert('Failed to remove item. Please try again.');
        } finally {
            setActionLoading(prev => ({ ...prev, [`remove-${itemId}`]: false }));
        }
    };

    const handleMoveToCart = async (item) => {
        try {
            setActionLoading(prev => ({ ...prev, [`cart-${item.id}`]: true }));
            
            // Add to cart using cart context
            await addToCart({
                id: item.product_id,
                name: item.product_name,
                price: item.product_price,
                image: item.product_image,
                size: item.size,
                color: item.color
            });
            
            // Remove from saved items
            await removeFromSavedItems(item.id);
            alert('Item moved to cart!');
        } catch (error) {
            console.error('Failed to move to cart:', error);
            alert('Failed to move to cart. Please try again.');
        } finally {
            setActionLoading(prev => ({ ...prev, [`cart-${item.id}`]: false }));
        }
    };

    const handleMoveToWishlist = async (item) => {
        try {
            setActionLoading(prev => ({ ...prev, [`wishlist-${item.id}`]: true }));
            
            // Add to wishlist using wishlist context
            await addToWishlist({
                id: item.product_id,
                name: item.product_name,
                price: item.product_price,
                image: item.product_image,
                size: item.size,
                color: item.color
            });
            
            // Remove from saved items
            await removeFromSavedItems(item.id);
            alert('Item moved to wishlist!');
        } catch (error) {
            console.error('Failed to move to wishlist:', error);
            alert('Failed to move to wishlist. Please try again.');
        } finally {
            setActionLoading(prev => ({ ...prev, [`wishlist-${item.id}`]: false }));
        }
    };

    const handleSaveNotes = async (itemId) => {
        try {
            await updateSavedItem(itemId, { notes: notes[itemId] });
            setEditingNotes(prev => ({ ...prev, [itemId]: false }));
            alert('Notes saved!');
        } catch (error) {
            console.error('Failed to save notes:', error);
            alert('Failed to save notes. Please try again.');
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to clear all saved items?')) {
            try {
                await clearSavedItems();
                alert('All saved items cleared!');
            } catch (error) {
                console.error('Failed to clear saved items:', error);
                alert('Failed to clear saved items. Please try again.');
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Please Login</h4>
                                <div className="breadcrumb__links">
                                    <Link to="/">Home</Link>
                                    <span>Saved Items</span>
                                </div>
                                <div className="text-center mt-4">
                                    <p>You need to be logged in to view your saved items.</p>
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
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Loading...</h4>
                                <div className="breadcrumb__links">
                                    <Link to="/">Home</Link>
                                    <span>Saved Items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Breadcrumb Section */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Saved Items</h4>
                                <div className="breadcrumb__links">
                                    <Link to="/">Home</Link>
                                    <span>Saved Items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Saved Items Section */}
            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shop__cart__table">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                
                                {savedItems.length === 0 ? (
                                    <div className="text-center py-5">
                                        <h5>Your saved items list is empty</h5>
                                        <p>Save items for later to see them here.</p>
                                        <Link to="/category" className="primary-btn">Continue Shopping</Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5>Your Saved Items ({savedItems.length})</h5>
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={handleClearAll}
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                        
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Size</th>
                                                    <th>Color</th>
                                                    <th>Notes</th>
                                                    <th>Actions</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="cart__product__item">
                                                            <img 
                                                                src={item.product_image || '/api/placeholder/80/80'} 
                                                                alt={item.product_name}
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                            />
                                                            <div className="cart__product__item__title">
                                                                <h6>
                                                                    <Link to={`/product/${item.product_slug || item.product_id}`}>
                                                                        {item.product_name}
                                                                    </Link>
                                                                </h6>
                                                                <div className="rating">
                                                                    <i className="fa fa-star"></i>
                                                                    <i className="fa fa-star"></i>
                                                                    <i className="fa fa-star"></i>
                                                                    <i className="fa fa-star"></i>
                                                                    <i className="fa fa-star"></i>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="cart__price">${item.product_price}</td>
                                                        <td className="cart__size">{item.size || 'N/A'}</td>
                                                        <td className="cart__color">{item.color || 'N/A'}</td>
                                                        <td className="cart__notes">
                                                            {editingNotes[item.id] ? (
                                                                <div>
                                                                    <textarea
                                                                        value={notes[item.id] || ''}
                                                                        onChange={(e) => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                                        placeholder="Add your notes..."
                                                                        rows="2"
                                                                        style={{ width: '100%', resize: 'vertical' }}
                                                                    />
                                                                    <div className="mt-2">
                                                                        <button 
                                                                            className="btn btn-sm btn-success me-2"
                                                                            onClick={() => handleSaveNotes(item.id)}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button 
                                                                            className="btn btn-sm btn-secondary"
                                                                            onClick={() => setEditingNotes(prev => ({ ...prev, [item.id]: false }))}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                                                        {item.notes || 'No notes'}
                                                                    </p>
                                                                    <button 
                                                                        className="btn btn-sm btn-link p-0"
                                                                        onClick={() => setEditingNotes(prev => ({ ...prev, [item.id]: true }))}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="cart__actions">
                                                            <div className="d-flex flex-column gap-2">
                                                                <button 
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleMoveToCart(item)}
                                                                    disabled={actionLoading[`cart-${item.id}`]}
                                                                >
                                                                    {actionLoading[`cart-${item.id}`] ? 'Moving...' : 'Add to Cart'}
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleMoveToWishlist(item)}
                                                                    disabled={actionLoading[`wishlist-${item.id}`]}
                                                                >
                                                                    {actionLoading[`wishlist-${item.id}`] ? 'Moving...' : 'Move to Wishlist'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="cart__close">
                                                            <span 
                                                                className="icon_close"
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                style={{ 
                                                                    cursor: actionLoading[`remove-${item.id}`] ? 'not-allowed' : 'pointer',
                                                                    opacity: actionLoading[`remove-${item.id}`] ? 0.5 : 1
                                                                }}
                                                            ></span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {savedItems.length > 0 && (
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="cart__btn">
                                    <Link to="/category">Continue Shopping</Link>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="cart__btn update__btn">
                                    <Link to="/wishlist">View Wishlist</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default SavedItems;