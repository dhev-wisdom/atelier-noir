import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductService from '../utils/productService';
import CategoryService from '../utils/categoryService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSavedItems } from '../contexts/SavedItemsContext';

const Category = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [addingToCart, setAddingToCart] = useState({});
    const [addingToWishlist, setAddingToWishlist] = useState({});
    const [addingToSavedItems, setAddingToSavedItems] = useState({});

    // Cart context
    const { addToCart, isInCart } = useCart();
    
    // Wishlist context
    const { addToWishlist: addProductToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    
    // SavedItems context
    const { addToSavedItems, removeFromSavedItems, isInSavedItems } = useSavedItems();

    // Helper function to fetch product images
    const fetchProductWithImages = async (product) => {
        try {
            const mainImage = await ProductService.getMainProductImage(product.id);
            return {
                ...product,
                mainImage: mainImage?.image || null
            };
        } catch (error) {
            console.warn(`Failed to fetch images for product ${product.id}:`, error);
            return product;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all categories for sidebar
                const categoriesResponse = await CategoryService.getAllCategories();
                setCategories(categoriesResponse.data || []);

                let productsData = [];
                // If category ID is provided, fetch category details and products
                if (id) {
                    const categoryResponse = await CategoryService.getCategoryById(id);
                    setCurrentCategory(categoryResponse.data);
                    
                    // Fetch products by category
                    const productsResponse = await ProductService.getProductsByCategory(id);
                    productsData = productsResponse.data || [];
                    
                    document.title = `${categoryResponse.data?.name || 'Category'} | Atelier Noir`;
                } else {
                    // Fetch all products if no category specified
                    const productsResponse = await ProductService.getAllProducts();
                    productsData = productsResponse.data || [];
                    document.title = "Shop All | Atelier Noir";
                }

                // Fetch images for each product
                const productsWithImages = await Promise.all(
                    productsData.map(fetchProductWithImages)
                );
                
                setProducts(productsWithImages);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            const price = parseFloat(product.price) || 0;
            const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
            const matchesSearch = !searchQuery || 
                (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesPrice && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
                case 'price-high':
                    return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
                case 'rating':
                    return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
                case 'newest':
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case 'name':
                default:
                    return (a.name || '').localeCompare(b.name || '');
            }
        });

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (e) => {
        const value = parseInt(e.target.value);
        setPriceRange([0, value]);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Search is handled in real-time, but we can add analytics here
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price || 0);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<i key={i} className="fa fa-star"></i>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<i key={i} className="fa fa-star-half-o"></i>);
            } else {
                stars.push(<i key={i} className="fa fa-star-o"></i>);
            }
        }
        return stars;
    };

    // Handle add to cart
    const handleAddToCart = async (product, selectedColor = null, selectedSize = null, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        try {
            setAddingToCart(prev => ({ ...prev, [product.id]: true }));
            await addToCart(product, 1, selectedColor, selectedSize);
            // Optional: Show success message
            console.log('Product added to cart successfully');
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            // Optional: Show error message
        } finally {
            setAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }
    };

    // Handle wishlist toggle
    const handleWishlistToggle = async (product, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        try {
            setAddingToWishlist(prev => ({ ...prev, [product.id]: true }));
            
            const inWishlist = isInWishlist(product.id);
            
            if (inWishlist) {
                await removeFromWishlist(product.id);
                console.log('Product removed from wishlist');
            } else {
                await addProductToWishlist(product);
                console.log('Product added to wishlist');
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
        } finally {
            setAddingToWishlist(prev => ({ ...prev, [product.id]: false }));
        }
    };

    // Handle saved items toggle
    const handleSavedItemsToggle = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            setAddingToSavedItems(prev => ({ ...prev, [product.id]: true }));
            
            const inSavedItems = isInSavedItems(product.id);
            
            if (inSavedItems) {
                await removeFromSavedItems(product.id);
                console.log('Product removed from saved items');
            } else {
                await addToSavedItems(product);
                console.log('Product saved for later');
            }
        } catch (error) {
            console.error('Failed to update saved items:', error);
        } finally {
            setAddingToSavedItems(prev => ({ ...prev, [product.id]: false }));
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-dark" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-3">Loading premium collection...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center py-5">
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        <Link to="/" className="btn btn-dark">Return to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb Section Begin */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>{currentCategory?.name || 'All Products'}</h4>
                                <div className="breadcrumb__links">
                                    <Link to="/">Home</Link>
                                    <span>{currentCategory?.name || 'Shop'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Shop Section Begin */}
            <section className="shop spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="shop__sidebar">
                                <div className="shop__sidebar__search">
                                    <form onSubmit={handleSearchSubmit}>
                                        <input 
                                            type="text" 
                                            placeholder="Search products..." 
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px 15px',
                                                border: '2px solid #f0f0f0',
                                                borderRadius: '25px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                        <button 
                                            type="submit"
                                            style={{
                                                position: 'absolute',
                                                right: '15px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                        >
                                            <span className="icon_search"></span>
                                        </button>
                                    </form>
                                </div>
                                <div className="shop__sidebar__accordion">
                                    <div className="accordion" id="accordionExample">
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseOne">Categories</a>
                                            </div>
                                            <div id="collapseOne" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="shop__sidebar__categories">
                                                        <ul className="nice-scroll">
                                                            <li><Link to="/shop/category" className={!id ? 'active' : ''}>All Products</Link></li>
                                                            {categories.map(category => (
                                                                <li key={category.id}>
                                                                    <Link 
                                                                        to={`/shop/category/${category.id}`}
                                                                        className={id === category.id.toString() ? 'active' : ''}
                                                                    >
                                                                        {category.name} ({category.product_count || 0})
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseTwo">Price Range</a>
                                            </div>
                                            <div id="collapseTwo" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="shop__sidebar__price">
                                                        <ul>
                                                            <li>
                                                                <a 
                                                                    href="#" 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setPriceRange([0, 50]);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                    className={priceRange[0] === 0 && priceRange[1] === 50 ? 'active' : ''}
                                                                >
                                                                    $0.00 - $50.00
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a 
                                                                    href="#" 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setPriceRange([50, 100]);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                    className={priceRange[0] === 50 && priceRange[1] === 100 ? 'active' : ''}
                                                                >
                                                                    $50.00 - $100.00
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a 
                                                                    href="#" 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setPriceRange([100, 150]);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                    className={priceRange[0] === 100 && priceRange[1] === 150 ? 'active' : ''}
                                                                >
                                                                    $100.00 - $150.00
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a 
                                                                    href="#" 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setPriceRange([150, 200]);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                    className={priceRange[0] === 150 && priceRange[1] === 200 ? 'active' : ''}
                                                                >
                                                                    $150.00 - $200.00
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a 
                                                                    href="#" 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setPriceRange([200, 1000]);
                                                                        setCurrentPage(1);
                                                                    }}
                                                                    className={priceRange[0] === 200 && priceRange[1] === 1000 ? 'active' : ''}
                                                                >
                                                                    $200.00+
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <div className="price-range-wrap">
                                                            <div className="price-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
                                                                <input 
                                                                    type="range" 
                                                                    min="0" 
                                                                    max="1000" 
                                                                    value={priceRange[1]} 
                                                                    onChange={handlePriceRangeChange}
                                                                    className="form-range"
                                                                />
                                                            </div>
                                                            <div className="range-slider">
                                                                <div className="price-input">
                                                                    <p>Price:</p>
                                                                    <input type="text" value={`$${priceRange[0]}.00 - $${priceRange[1]}.00`} readOnly />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="shop__product__option">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="shop__product__option__left">
                                            <p>Showing {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="shop__product__option__right">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div>
                                                    <p style={{ margin: '0 10px 0 0', display: 'inline' }}>Sort by:</p>
                                                    <select 
                                                        value={sortBy} 
                                                        onChange={handleSortChange}
                                                        style={{
                                                            padding: '8px 12px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <option value="name">Name</option>
                                                        <option value="price-low">Price: Low to High</option>
                                                        <option value="price-high">Price: High to Low</option>
                                                        <option value="rating">Rating</option>
                                                        <option value="newest">Newest</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                                        style={{
                                                            padding: '8px 12px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            background: '#fff',
                                                            cursor: 'pointer',
                                                            fontSize: '14px'
                                                        }}
                                                        title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                                                    >
                                                        <i className={`fa fa-${viewMode === 'grid' ? 'list' : 'th'}`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {currentProducts.length > 0 ? (
                                    currentProducts.map(product => (
                                        <div key={product.id} className={viewMode === 'grid' ? "col-lg-4 col-md-6 col-sm-6" : "col-12"}>
                                            <div className={`product__item ${viewMode === 'list' ? 'product__item--list' : ''}`} 
                                                style={viewMode === 'list' ? {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '20px',
                                                    marginBottom: '20px',
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: '8px'
                                                } : {}}>
                                                <div className="product__item__pic set-bg" 
                                                    style={{ 
                                                        backgroundImage: `url('${product.mainImage || product.image || '/src/assets/img/product/product-1.jpg'}')`,
                                                        ...(viewMode === 'list' ? {
                                                            width: '200px',
                                                            height: '200px',
                                                            minWidth: '200px',
                                                            marginRight: '20px'
                                                        } : {})
                                                    }}>
                                                    {product.sale_price && product.sale_price < product.price && (
                                                        <span className="label" style={{ background: '#e74c3c' }}>Sale</span>
                                                    )}
                                                    {!product.sale_price && (
                                                        <span className="label">New</span>
                                                    )}
                                                    <ul className="product__hover">
                                                        <li>
                                                            <a 
                                                                href="#" 
                                                                onClick={(e) => handleWishlistToggle(product, e)}
                                                                style={{ 
                                                                    opacity: addingToWishlist[product.id] ? 0.6 : 1,
                                                                    pointerEvents: addingToWishlist[product.id] ? 'none' : 'auto',
                                                                    color: isInWishlist(product.id) ? '#e53637' : '#333'
                                                                }}
                                                                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                                            >
                                                                <img src="/src/assets/img/icon/heart.png" alt="" />
                                                                {addingToWishlist[product.id] && <span className="fa fa-spinner fa-spin" style={{ marginLeft: '5px' }}></span>}
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a 
                                                                href="#" 
                                                                onClick={(e) => handleSavedItemsToggle(product, e)}
                                                                style={{ 
                                                                    opacity: addingToSavedItems[product.id] ? 0.6 : 1,
                                                                    pointerEvents: addingToSavedItems[product.id] ? 'none' : 'auto',
                                                                    color: isInSavedItems(product.id) ? '#007bff' : '#333'
                                                                }}
                                                                title={isInSavedItems(product.id) ? 'Remove from saved items' : 'Save for later'}
                                                            >
                                                                <img src="/src/assets/img/icon/bookmark.png" alt="" />
                                                                {addingToSavedItems[product.id] && <span className="fa fa-spinner fa-spin" style={{ marginLeft: '5px' }}></span>}
                                                            </a>
                                                        </li>
                                                        <li><a href="#"><img src="/src/assets/img/icon/compare.png" alt="" /> <span>Compare</span></a></li>
                                                        <li>
                                                            <a 
                                                                href="#" 
                                                                onClick={(e) => handleAddToCart(product, null, null, e)}
                                                                style={{ 
                                                                    opacity: addingToCart[product.id] ? 0.6 : 1,
                                                                    pointerEvents: addingToCart[product.id] ? 'none' : 'auto'
                                                                }}
                                                            >
                                                                <img src="/src/assets/img/icon/cart.png" alt="" />
                                                                {addingToCart[product.id] && <span className="fa fa-spinner fa-spin" style={{ marginLeft: '5px' }}></span>}
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="product__item__text" style={viewMode === 'list' ? { flex: 1 } : {}}>
                                                    <h6>
                                                        <Link to={`/shop/product-details/${product.id}`} 
                                                            style={{ 
                                                                color: '#333',
                                                                textDecoration: 'none',
                                                                fontSize: viewMode === 'list' ? '18px' : '16px',
                                                                fontWeight: '600'
                                                            }}>
                                                            {product.name}
                                                        </Link>
                                                    </h6>
                                                    <div className="rating" style={{ margin: '10px 0' }}>
                                                        {renderStars(product.rating)}
                                                        <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                                                            ({product.rating || 0})
                                                        </span>
                                                    </div>
                                                    <div className="price-section" style={{ margin: '10px 0' }}>
                                                        {product.sale_price && product.sale_price < product.price ? (
                                                            <>
                                                                <h5 style={{ color: '#e74c3c', display: 'inline', marginRight: '10px' }}>
                                                                    {formatPrice(product.sale_price)}
                                                                </h5>
                                                                <span style={{ 
                                                                    textDecoration: 'line-through', 
                                                                    color: '#999',
                                                                    fontSize: '14px'
                                                                }}>
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <h5 style={{ color: '#333' }}>{formatPrice(product.price)}</h5>
                                                        )}
                                                    </div>
                                                    {viewMode === 'list' && product.description && (
                                                        <p style={{ 
                                                            color: '#666', 
                                                            fontSize: '14px', 
                                                            margin: '10px 0',
                                                            lineHeight: '1.5'
                                                        }}>
                                                            {product.description.length > 150 
                                                                ? `${product.description.substring(0, 150)}...` 
                                                                : product.description}
                                                        </p>
                                                    )}
                                                    <div className="product__color__select" style={{ marginTop: '15px' }}>
                                                        {product.colors && product.colors.length > 0 ? (
                                                            product.colors.slice(0, 3).map((color, index) => (
                                                                <label key={index} htmlFor={`pc-${product.id}-${index}`} 
                                                                    className={index === 0 ? 'active' : ''} 
                                                                    style={{ backgroundColor: color.toLowerCase() }}>
                                                                    <input type="radio" id={`pc-${product.id}-${index}`} />
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <label htmlFor={`pc-${product.id}-1`} className="active c-1">
                                                                    <input type="radio" id={`pc-${product.id}-1`} />
                                                                </label>
                                                                <label htmlFor={`pc-${product.id}-2`} className="c-2">
                                                                    <input type="radio" id={`pc-${product.id}-2`} />
                                                                </label>
                                                                <label htmlFor={`pc-${product.id}-3`} className="c-3">
                                                                    <input type="radio" id={`pc-${product.id}-3`} />
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                    {viewMode === 'list' && (
                                                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                                            <Link 
                                                                to={`/shop/product-details/${product.id}`}
                                                                className="btn btn-outline-dark"
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'none',
                                                                    display: 'inline-block'
                                                                }}
                                                            >
                                                                View Details
                                                            </Link>
                                                            <button
                                                                onClick={(e) => handleWishlistToggle(product, e)}
                                                                className={`btn ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                                                                disabled={addingToWishlist[product.id]}
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    fontSize: '14px',
                                                                    opacity: addingToWishlist[product.id] ? 0.6 : 1
                                                                }}
                                                                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                                            >
                                                                {addingToWishlist[product.id] ? (
                                                                    <>
                                                                        <span className="fa fa-spinner fa-spin"></span> {isInWishlist(product.id) ? 'Removing...' : 'Adding...'}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-heart"></i> {isInWishlist(product.id) ? 'Remove' : 'Wishlist'}
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleSavedItemsToggle(product, e)}
                                                                className={`btn ${isInSavedItems(product.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                disabled={addingToSavedItems[product.id]}
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    fontSize: '14px',
                                                                    opacity: addingToSavedItems[product.id] ? 0.6 : 1
                                                                }}
                                                                title={isInSavedItems(product.id) ? 'Remove from saved items' : 'Save for later'}
                                                            >
                                                                {addingToSavedItems[product.id] ? (
                                                                    <>
                                                                        <span className="fa fa-spinner fa-spin"></span> {isInSavedItems(product.id) ? 'Removing...' : 'Saving...'}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-bookmark"></i> {isInSavedItems(product.id) ? 'Remove' : 'Save'}
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleAddToCart(product, null, null, e)}
                                                                className="btn btn-dark"
                                                                disabled={addingToCart[product.id]}
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    fontSize: '14px',
                                                                    opacity: addingToCart[product.id] ? 0.6 : 1
                                                                }}
                                                            >
                                                                {addingToCart[product.id] ? (
                                                                    <>
                                                                        <span className="fa fa-spinner fa-spin"></span> Adding...
                                                                    </>
                                                                ) : (
                                                                    'Add to Cart'
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center py-5">
                                        <h4>No products found</h4>
                                        <p>Try adjusting your filters or browse our other categories.</p>
                                        <Link to="/" className="btn btn-dark">Continue Shopping</Link>
                                    </div>
                                )}
                            </div>
                            {totalPages > 1 && (
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="product__pagination">
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <a 
                                                    key={i + 1}
                                                    href="#"
                                                    className={currentPage === i + 1 ? 'current-page' : ''}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(i + 1);
                                                        window.scrollTo(0, 0);
                                                    }}
                                                >
                                                    {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {/* Shop Section End */}
        </>
    );
};

export default Category;