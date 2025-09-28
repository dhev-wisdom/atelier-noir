import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ProductService from '../utils/productService';
import CategoryService from '../utils/categoryService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSavedItems } from '../contexts/SavedItemsContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToSavedItems, removeFromSavedItems, isInSavedItems } = useSavedItems();
    
    // State management
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    
    // UI state
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('tabs-1');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const [addingToSavedItems, setAddingToSavedItems] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch product details
            const productData = await ProductService.getProductById(id);
            setProduct(productData);
            
            // Update document title
            document.title = `${productData.name || 'Product Details'} | Atelier Noir`;
            
            // Fetch category details if product has category
            if (productData.category) {
                try {
                    const categoryData = await CategoryService.getCategoryById(productData.category);
                    setCategory(categoryData);
                    
                    // Fetch related products from same category
                    const relatedData = await ProductService.getProductsByCategory(productData.category, 1, 4);
                    setRelatedProducts(relatedData.results?.filter(p => p.id !== parseInt(id)) || []);
                } catch (categoryError) {
                    console.warn('Failed to fetch category details:', categoryError);
                }
            }
            
            // Fetch product reviews
            fetchProductReviews();
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Failed to load product details. Please try again later.');
            setLoading(false);
        }
    };

    const fetchProductReviews = async () => {
        try {
            setReviewsLoading(true);
            const reviewsData = await ProductService.getProductReviews(id);
            setReviews(reviewsData.results || []);
        } catch (err) {
            console.warn('Failed to fetch reviews:', err);
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const handleAddToCart = async () => {
        if (!product) return;
        
        setAddingToCart(true);
        
        try {
            await addToCart(product, quantity, selectedColor, selectedSize);
            console.log('Product added to cart successfully:', {
                productId: product.id,
                quantity,
                selectedSize,
                selectedColor
            });
            // You could show a success message here
            alert('Product added to cart!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;
        
        setAddingToWishlist(true);
        
        try {
            const inWishlist = isInWishlist(product.id);
            
            if (inWishlist) {
                await removeFromWishlist(product.id);
                alert('Product removed from wishlist!');
            } else {
                await addToWishlist(product);
                alert('Product added to wishlist!');
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
            alert('Failed to update wishlist. Please try again.');
        } finally {
            setAddingToWishlist(false);
        }
    };

    const handleSavedItemsToggle = async () => {
        if (!product) return;
        
        setAddingToSavedItems(true);
        
        try {
            const inSavedItems = isInSavedItems(product.id);
            
            if (inSavedItems) {
                await removeFromSavedItems(product.id);
                alert('Product removed from saved items!');
            } else {
                await addToSavedItems(product);
                alert('Product saved for later!');
            }
        } catch (error) {
            console.error('Error updating saved items:', error);
            alert('Failed to update saved items. Please try again.');
        } finally {
            setAddingToSavedItems(false);
        }
    };

    const handleImageClick = (index) => {
        setActiveImageIndex(index);
    };

    const formatPrice = (price) => {
        return parseFloat(price || 0).toFixed(2);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="fa fa-star" style={{ color: '#f39c12' }}></i>);
        }
        
        if (hasHalfStar) {
            stars.push(<i key="half" className="fa fa-star-half-o" style={{ color: '#f39c12' }}></i>);
        }
        
        const emptyStars = 5 - Math.ceil(rating || 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="fa fa-star-o" style={{ color: '#ddd' }}></i>);
        }
        
        return stars;
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #ca1515',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <p style={{ color: '#666', fontSize: '16px' }}>Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    maxWidth: '500px'
                }}>
                    <i className="fa fa-exclamation-triangle" style={{ 
                        fontSize: '48px', 
                        color: '#dc3545',
                        marginBottom: '20px'
                    }}></i>
                    <h3 style={{ color: '#333', marginBottom: '15px' }}>Product Not Found</h3>
                    <p style={{ color: '#666', marginBottom: '25px' }}>{error}</p>
                    <button 
                        onClick={() => navigate('/shop')}
                        style={{
                            backgroundColor: '#ca1515',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    // Get product images (fallback to placeholder if none available)
    const productImages = product.images && product.images.length > 0 
        ? product.images 
        : [{ image: '/src/assets/img/product/product-1.jpg', alt: product.name }];

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .product__details__pic__left .pt {
                        cursor: pointer;
                        opacity: 0.7;
                        transition: opacity 0.3s ease;
                    }
                    
                    .product__details__pic__left .pt.active,
                    .product__details__pic__left .pt:hover {
                        opacity: 1;
                    }
                    
                    .size-option, .color-option {
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .size-option:hover, .color-option:hover {
                        background-color: #ca1515 !important;
                        color: white !important;
                    }
                    
                    .size-option.active, .color-option.active {
                        background-color: #ca1515 !important;
                        color: white !important;
                    }
                `}
            </style>
            
            {/* Breadcrumb Begin */}
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <Link to="/shop">Shop</Link>
                                {category && (
                                    <Link to={`/shop/category/${category.id}`}>{category.name}</Link>
                                )}
                                <span>{product.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Product Details Section Begin */}
            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="product__details__pic">
                                <div className="product__details__pic__left product__thumb nice-scroll">
                                    {productImages.map((img, index) => (
                                        <div 
                                            key={index}
                                            className={`pt ${index === activeImageIndex ? 'active' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <img 
                                                src={img.image || '/src/assets/img/product/product-1.jpg'} 
                                                alt={img.alt || product.name}
                                                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="product__details__slider__content">
                                    <div className="product__details__pic__slider">
                                        <img 
                                            className="product__big__img" 
                                            src={productImages[activeImageIndex]?.image || '/src/assets/img/product/product-1.jpg'} 
                                            alt={product.name}
                                            style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="product__details__text">
                                <h3>{product.name}</h3>
                                <div className="rating">
                                    {renderStars(product.rating)}
                                    <span>( {reviews.length} reviews )</span>
                                </div>
                                <div className="product__details__price">
                                    ${formatPrice(product.price)}
                                    {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                                        <span style={{ 
                                            textDecoration: 'line-through', 
                                            color: '#999', 
                                            marginLeft: '10px',
                                            fontSize: '14px'
                                        }}>
                                            ${formatPrice(product.original_price)}
                                        </span>
                                    )}
                                </div>
                                <p>{product.description || 'No description available for this product.'}</p>
                                
                                <div className="product__details__button">
                                    <div className="quantity">
                                        <span>Quantity:</span>
                                        <div className="pro-qty">
                                            <input 
                                                type="number" 
                                                value={quantity} 
                                                onChange={handleQuantityChange}
                                                min="1"
                                                max={product.stock || 99}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        className="cart-btn"
                                        onClick={handleAddToCart}
                                        disabled={addingToCart || !product.in_stock}
                                        style={{
                                            opacity: addingToCart || !product.in_stock ? 0.6 : 1,
                                            cursor: addingToCart || !product.in_stock ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <span className="icon_bag_alt"></span> 
                                        {addingToCart ? 'Adding...' : 'Add to cart'}
                                    </button>
                                    <ul>
                                        <li>
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleWishlistToggle();
                                                }}
                                                style={{
                                                    opacity: addingToWishlist ? 0.6 : 1,
                                                    cursor: addingToWishlist ? 'not-allowed' : 'pointer',
                                                    color: isInWishlist(product?.id) ? '#e53637' : '#333'
                                                }}
                                                title={isInWishlist(product?.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                            >
                                                <span className="icon_heart_alt"></span>
                                            </a>
                                        </li>
                                        <li><a href="#"><span className="icon_adjust-horiz"></span></a></li>
                                    </ul>
                                </div>
                                
                                <div className="product__details__widget">
                                    <ul>
                                        <li>
                                            <span>Availability:</span>
                                            <div className="stock__checkbox">
                                                <label htmlFor="stockin">
                                                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                    <input 
                                                        type="checkbox" 
                                                        id="stockin" 
                                                        checked={product.in_stock}
                                                        readOnly
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </li>
                                        
                                        {product.colors && product.colors.length > 0 && (
                                            <li>
                                                <span>Available color:</span>
                                                <div className="color__checkbox">
                                                    {product.colors.map((color, index) => (
                                                        <label key={index} htmlFor={`color-${index}`}>
                                                            <input 
                                                                type="radio" 
                                                                name="color__radio" 
                                                                id={`color-${index}`}
                                                                value={color}
                                                                checked={selectedColor === color}
                                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                            />
                                                            <span 
                                                                className="checkmark"
                                                                style={{ backgroundColor: color.toLowerCase() }}
                                                            ></span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </li>
                                        )}
                                        
                                        {product.sizes && product.sizes.length > 0 && (
                                            <li>
                                                <span>Available size:</span>
                                                <div className="size__btn">
                                                    {product.sizes.map((size, index) => (
                                                        <label 
                                                            key={index}
                                                            htmlFor={`size-${index}`} 
                                                            className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                                            onClick={() => setSelectedSize(size)}
                                                            style={{
                                                                backgroundColor: selectedSize === size ? '#ca1515' : 'transparent',
                                                                color: selectedSize === size ? 'white' : '#333',
                                                                border: '1px solid #ddd',
                                                                padding: '8px 12px',
                                                                margin: '0 5px 5px 0',
                                                                display: 'inline-block',
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            <input 
                                                                type="radio" 
                                                                id={`size-${index}`}
                                                                name="size"
                                                                value={size}
                                                                checked={selectedSize === size}
                                                                onChange={(e) => setSelectedSize(e.target.value)}
                                                                style={{ display: 'none' }}
                                                            />
                                                            {size}
                                                        </label>
                                                    ))}
                                                </div>
                                            </li>
                                        )}
                                        
                                        <li>
                                            <span>Category:</span>
                                            <p>{category?.name || 'Uncategorized'}</p>
                                        </li>
                                        
                                        {product.brand && (
                                            <li>
                                                <span>Brand:</span>
                                                <p>{product.brand}</p>
                                            </li>
                                        )}
                                        
                                        <li>
                                            <span>Promotions:</span>
                                            <p>Free shipping on orders over $50</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="product__details__tab">
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link ${activeTab === 'tabs-1' ? 'active' : ''}`} 
                                            onClick={() => handleTabClick('tabs-1')}
                                            href="#tabs-1" 
                                            role="tab"
                                        >
                                            Description
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link ${activeTab === 'tabs-2' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('tabs-2')}
                                            href="#tabs-2" 
                                            role="tab"
                                        >
                                            Specification
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link ${activeTab === 'tabs-3' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('tabs-3')}
                                            href="#tabs-3" 
                                            role="tab"
                                        >
                                            Reviews ( {reviews.length} )
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className={`tab-pane ${activeTab === 'tabs-1' ? 'active' : ''}`} id="tabs-1" role="tabpanel">
                                        <h6>Description</h6>
                                        <div style={{ lineHeight: '1.6', color: '#666' }}>
                                            {product.description ? (
                                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                            ) : (
                                                <p>No detailed description available for this product.</p>
                                            )}
                                        </div>
                                        
                                        {product.features && product.features.length > 0 && (
                                            <div style={{ marginTop: '20px' }}>
                                                <h6>Key Features:</h6>
                                                <ul style={{ paddingLeft: '20px' }}>
                                                    {product.features.map((feature, index) => (
                                                        <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className={`tab-pane ${activeTab === 'tabs-2' ? 'active' : ''}`} id="tabs-2" role="tabpanel">
                                        <h6>Specifications</h6>
                                        {product.specifications ? (
                                            <div style={{ lineHeight: '1.6' }}>
                                                {Object.entries(product.specifications).map(([key, value]) => (
                                                    <div key={key} style={{ 
                                                        display: 'flex', 
                                                        marginBottom: '10px',
                                                        borderBottom: '1px solid #eee',
                                                        paddingBottom: '8px'
                                                    }}>
                                                        <strong style={{ 
                                                            minWidth: '150px', 
                                                            color: '#333',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {key.replace('_', ' ')}:
                                                        </strong>
                                                        <span style={{ color: '#666' }}>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    marginBottom: '10px',
                                                    borderBottom: '1px solid #eee',
                                                    paddingBottom: '8px'
                                                }}>
                                                    <strong style={{ minWidth: '150px', color: '#333' }}>Material:</strong>
                                                    <span style={{ color: '#666' }}>{product.material || 'Not specified'}</span>
                                                </div>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    marginBottom: '10px',
                                                    borderBottom: '1px solid #eee',
                                                    paddingBottom: '8px'
                                                }}>
                                                    <strong style={{ minWidth: '150px', color: '#333' }}>Brand:</strong>
                                                    <span style={{ color: '#666' }}>{product.brand || 'Atelier Noir'}</span>
                                                </div>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    marginBottom: '10px',
                                                    borderBottom: '1px solid #eee',
                                                    paddingBottom: '8px'
                                                }}>
                                                    <strong style={{ minWidth: '150px', color: '#333' }}>Category:</strong>
                                                    <span style={{ color: '#666' }}>{category?.name || 'Uncategorized'}</span>
                                                </div>
                                                {product.weight && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        marginBottom: '10px',
                                                        borderBottom: '1px solid #eee',
                                                        paddingBottom: '8px'
                                                    }}>
                                                        <strong style={{ minWidth: '150px', color: '#333' }}>Weight:</strong>
                                                        <span style={{ color: '#666' }}>{product.weight}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className={`tab-pane ${activeTab === 'tabs-3' ? 'active' : ''}`} id="tabs-3" role="tabpanel">
                                        <h6>Reviews ({reviews.length})</h6>
                                        
                                        {reviewsLoading ? (
                                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                                <div style={{ 
                                                    width: '30px', 
                                                    height: '30px', 
                                                    border: '3px solid #f3f3f3',
                                                    borderTop: '3px solid #ca1515',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    margin: '0 auto 10px'
                                                }}></div>
                                                <p>Loading reviews...</p>
                                            </div>
                                        ) : reviews.length > 0 ? (
                                            <div>
                                                {reviews.map((review, index) => (
                                                    <div key={index} style={{ 
                                                        borderBottom: '1px solid #eee',
                                                        paddingBottom: '20px',
                                                        marginBottom: '20px'
                                                    }}>
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '10px'
                                                        }}>
                                                            <div>
                                                                <strong style={{ color: '#333' }}>
                                                                    {review.user_name || 'Anonymous User'}
                                                                </strong>
                                                                <div style={{ marginTop: '5px' }}>
                                                                    {renderStars(review.rating)}
                                                                </div>
                                                            </div>
                                                            <span style={{ color: '#999', fontSize: '12px' }}>
                                                                {new Date(review.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                textAlign: 'center', 
                                                padding: '40px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px'
                                            }}>
                                                <i className="fa fa-comment-o" style={{ 
                                                    fontSize: '48px', 
                                                    color: '#ddd',
                                                    marginBottom: '15px'
                                                }}></i>
                                                <h6 style={{ color: '#666', marginBottom: '10px' }}>No Reviews Yet</h6>
                                                <p style={{ color: '#999', fontSize: '14px' }}>
                                                    Be the first to review this product!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <div className="row" style={{ marginTop: '50px' }}>
                            <div className="col-lg-12">
                                <div className="section-title">
                                    <h4>Related Products</h4>
                                </div>
                            </div>
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className="col-lg-3 col-md-6">
                                    <div className="product__item">
                                        <div className="product__item__pic set-bg" 
                                            style={{ 
                                                backgroundImage: `url(${relatedProduct.image || '/src/assets/img/product/product-1.jpg'})`,
                                                height: '250px',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}>
                                            {relatedProduct.is_sale && (
                                                <div className="label sale">Sale</div>
                                            )}
                                            {relatedProduct.is_new && (
                                                <div className="label new">New</div>
                                            )}
                                            <ul className="product__hover">
                                                <li><a href="#"><span className="icon_heart_alt"></span></a></li>
                                                <li><a href="#"><span className="icon_bag_alt"></span></a></li>
                                            </ul>
                                        </div>
                                        <div className="product__item__text">
                                            <h6>
                                                <Link to={`/product/${relatedProduct.id}`}>
                                                    {relatedProduct.name}
                                                </Link>
                                            </h6>
                                            <div className="rating">
                                                {renderStars(relatedProduct.rating)}
                                            </div>
                                            <div className="product__price">
                                                ${formatPrice(relatedProduct.price)}
                                                {relatedProduct.original_price && 
                                                parseFloat(relatedProduct.original_price) > parseFloat(relatedProduct.price) && (
                                                    <span>${formatPrice(relatedProduct.original_price)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            {/* Product Details Section End */}
        </>
    );
};

export default ProductDetail;