import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductService from '../utils/productService';
import CategoryService from '../utils/categoryService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSavedItems } from '../contexts/SavedItemsContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [bestSellersProducts, setBestSellersProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trendLoading, setTrendLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('*');
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
        // Set document title
        document.title = "Atelier Noir | Home";
        
        // Fetch main products and categories
        const fetchMainData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    ProductService.getAllProducts(1, 8),
                    CategoryService.getAllCategories()
                ]);
                
                // Fetch images for each product
                const productsWithImages = await Promise.all(
                    (productsData.results || []).map(fetchProductWithImages)
                );
                
                setProducts(productsWithImages);
                setCategories(categoriesData.results || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching main data:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        // Fetch trending data
        const fetchTrendingData = async () => {
            try {
                setTrendLoading(true);
                console.log('Fetching trending data...');
                
                // Try to fetch trending products
                let trendingData = { results: [] };
                try {
                    trendingData = await ProductService.getTrendingProducts(3);
                    console.log('Trending products:', trendingData);
                } catch (error) {
                    console.warn('Trending products API failed, using fallback:', error);
                    // Fallback: use regular products as trending
                    try {
                        const fallbackData = await ProductService.getAllProducts(1, 3);
                        trendingData = { results: fallbackData.results?.slice(0, 3) || [] };
                        console.log('Using fallback trending products:', trendingData);
                    } catch (fallbackError) {
                        console.error('Fallback trending products failed:', fallbackError);
                    }
                }

                // Try to fetch best sellers
                let bestSellersData = { results: [] };
                try {
                    bestSellersData = await ProductService.getBestSellersProducts(3);
                    console.log('Best sellers products:', bestSellersData);
                } catch (error) {
                    console.warn('Best sellers API failed, using fallback:', error);
                    // Fallback: use regular products as best sellers
                    try {
                        const fallbackData = await ProductService.getAllProducts(1, 3);
                        bestSellersData = { results: fallbackData.results?.slice(0, 3) || [] };
                        console.log('Using fallback best sellers products:', bestSellersData);
                    } catch (fallbackError) {
                        console.error('Fallback best sellers failed:', fallbackError);
                    }
                }

                // Try to fetch featured products
                let featuredData = { results: [] };
                try {
                    featuredData = await ProductService.getFeaturedProducts(3);
                    console.log('Featured products:', featuredData);
                } catch (error) {
                    console.warn('Featured products API failed, using fallback:', error);
                    // Fallback: use regular products as featured
                    try {
                        const fallbackData = await ProductService.getAllProducts(1, 3);
                        featuredData = { results: fallbackData.results?.slice(0, 3) || [] };
                        console.log('Using fallback featured products:', featuredData);
                    } catch (fallbackError) {
                        console.error('Fallback featured products failed:', fallbackError);
                    }
                }
                
                // Fetch images for trending, best sellers, and featured products
                const [trendingWithImages, bestSellersWithImages, featuredWithImages] = await Promise.all([
                    Promise.all((trendingData.results || []).map(fetchProductWithImages)),
                    Promise.all((bestSellersData.results || []).map(fetchProductWithImages)),
                    Promise.all((featuredData.results || []).map(fetchProductWithImages))
                ]);
                
                setTrendingProducts(trendingWithImages);
                setBestSellersProducts(bestSellersWithImages);
                setFeaturedProducts(featuredWithImages);
                
                console.log('Final trending state:', trendingWithImages);
                console.log('Final best sellers state:', bestSellersWithImages);
                console.log('Final featured state:', featuredWithImages);
                
                setTrendLoading(false);
            } catch (err) {
                console.error('Error fetching trending data:', err);
                // Use fallback data or empty arrays
                setTrendingProducts([]);
                setBestSellersProducts([]);
                setFeaturedProducts([]);
                setTrendLoading(false);
            }
        };
        
        fetchMainData();
        fetchTrendingData();
    }, []);

    // Handle add to cart
    const handleAddToCart = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            setAddingToCart(prev => ({ ...prev, [product.id]: true }));
            await addToCart(product, 1);
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
        e.preventDefault();
        e.stopPropagation();
        
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

    // Filter products based on active filter
    const filteredProducts = activeFilter === '*' 
        ? products 
        : products.filter(product => 
            product.category && 
            product.category.name.toLowerCase() === activeFilter
        );

    // Render trend item component
    const renderTrendItem = (product, index, fallbackPrefix) => {
        const fallbackImage = `/src/assets/img/trend/${fallbackPrefix}-${index + 1}.jpg`;
        const fallbackName = `${fallbackPrefix === 'ht' ? 'Hot Trend' : fallbackPrefix === 'bs' ? 'Best Seller' : 'Featured'} Item ${index + 1}`;
        const fallbackPrice = fallbackPrefix === 'ht' ? 39 + index : fallbackPrefix === 'bs' ? 59 + index : 49 + index;

        return (
            <div key={product?.id || `${fallbackPrefix}-${index}`} className="trend__item">
                <div className="trend__item__pic">
                    <img 
                        src={product?.mainImage || product?.image || fallbackImage} 
                        alt={product?.name || fallbackName}
                        onError={(e) => {
                            e.target.src = fallbackImage;
                        }}
                    />
                </div>
                <div className="trend__item__text">
                    <h6>
                        <Link to={`/shop/product-details/${product?.id || '#'}`}>
                            {product?.name || fallbackName}
                        </Link>
                    </h6>
                    <div className="rating">
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa fa-star${i < Math.floor(product?.rating || 5) ? '' : '-o'}`}></i>
                        ))}
                    </div>
                    <div className="product__price">
                        ${product?.price || `${fallbackPrice}.00`}
                        {product?.old_price && <span>${product.old_price}</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Hero Banner Section Begin */}
            <section className="hero">
                <div className="hero__slider owl-carousel">
                    <div className="hero__items set-bg" style={{ backgroundImage: "url('/src/assets/img/hero/hero-1.jpg')" }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-5 col-lg-7 col-md-8">
                                    <div className="hero__text">
                                        <h6>Summer Collection</h6>
                                        <h1>Fall - Winter Collections 2030</h1>
                                        <p>A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.</p>
                                        <Link to="/shop/category" className="primary-btn">Shop now <span className="arrow_right"></span></Link>
                                        <div className="hero__social">
                                            <a href="#"><i className="fa fa-facebook"></i></a>
                                            <a href="#"><i className="fa fa-twitter"></i></a>
                                            <a href="#"><i className="fa fa-instagram"></i></a>
                                            <a href="#"><i className="fa fa-dribbble"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero__items set-bg" style={{ backgroundImage: "url('/src/assets/img/hero/hero-2.jpg')" }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-5 col-lg-7 col-md-8">
                                    <div className="hero__text">
                                        <h6>Atelier Noir</h6>
                                        <h1>New Arrivals Collection 2030</h1>
                                        <p>Discover our exclusive collection of luxury fashion items, crafted with precision and unparalleled attention to detail.</p>
                                        <Link to="/shop/category" className="primary-btn">Shop now <span className="arrow_right"></span></Link>
                                        <div className="hero__social">
                                            <a href="#"><i className="fa fa-facebook"></i></a>
                                            <a href="#"><i className="fa fa-twitter"></i></a>
                                            <a href="#"><i className="fa fa-instagram"></i></a>
                                            <a href="#"><i className="fa fa-dribbble"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Hero Banner Section End */}

            {/* Categories Section Begin */}
            <section className="categories">
                <div className="container-fluid">
                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center py-5">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-3">Loading our exclusive collections...</p>
                            </div>
                        ) : categories.length > 0 ? (
                            <>
                                <div className="col-lg-6 p-0">
                                    <div className="categories__item categories__large__item set-bg"
                                        style={{ backgroundImage: `url('${categories[0]?.image || '/src/assets/img/categories/category-1.jpg'}')` }}>
                                        <div className="categories__text">
                                            <h1>{categories[0]?.name || "Women's Fashion"}</h1>
                                            <p>{categories[0]?.description || "Discover our latest collection of stylish and trendy fashion items crafted for the modern woman."}</p>
                                            <Link to={`/shop/category/${categories[0]?.id || "1"}`}>Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="row">
                                        {categories.slice(1, 5).map((category, index) => (
                                            <div key={category.id} className="col-lg-6 col-md-6 col-sm-6 p-0">
                                                <div className="categories__item set-bg" 
                                                    style={{ backgroundImage: `url('${category.image || `/src/assets/img/categories/category-${index + 2}.jpg`}')` }}>
                                                    <div className="categories__text">
                                                        <h4>{category.name}</h4>
                                                        <p>{category.product_count || 0} items</p>
                                                        <Link to={`/shop/category/${category.id}`}>Shop now</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Fill remaining slots with placeholder categories if needed */}
                                        {categories.length < 5 && [...Array(5 - categories.length)].map((_, index) => (
                                            <div key={`placeholder-${index}`} className="col-lg-6 col-md-6 col-sm-6 p-0">
                                                <div className="categories__item set-bg" 
                                                    style={{ backgroundImage: `url('/src/assets/img/categories/category-${categories.length + index + 1}.jpg')` }}>
                                                    <div className="categories__text">
                                                        <h4>Coming Soon</h4>
                                                        <p>New collection</p>
                                                        <Link to="/shop/category">Explore</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h3>Curating Our Collections</h3>
                                <p>Our exclusive categories are being prepared for you. Check back soon!</p>
                                <Link to="/shop/category" className="btn btn-dark">Browse All Products</Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* Categories Section End */}

            {/* Product Section Begin */}
            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="section-title">
                                <h4>New Arrivals</h4>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                            <ul className="filter__controls">
                                <li 
                                    className={activeFilter === '*' ? 'active' : ''} 
                                    onClick={() => setActiveFilter('*')}
                                    data-testid="filter-all"
                                >
                                    All
                                </li>
                                {categories.map(category => (
                                    <li 
                                        key={category.id}
                                        className={activeFilter === category.name.toLowerCase() ? 'active' : ''} 
                                        onClick={() => setActiveFilter(category.name.toLowerCase())}
                                        data-testid={`filter-${category.name.toLowerCase()}`}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="row property__gallery">
                        {loading ? (
                            <div className="col-12 text-center py-5">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-3">Loading our latest arrivals...</p>
                            </div>
                        ) : error ? (
                            <div className="col-12 text-center py-5">
                                <h4>Something went wrong</h4>
                                <p className="text-muted">{error}</p>
                                <button 
                                    className="btn btn-dark" 
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <h4>No products available</h4>
                                <p className="text-muted">Our collection is being curated. Check back soon for exclusive items!</p>
                                <Link to="/shop/category" className="btn btn-dark">Browse Categories</Link>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} className={`col-lg-3 col-md-4 col-sm-6 mix ${product.category ? product.category.name.toLowerCase() : ''}`}>
                                    <div className="product__item">
                                        <div className="product__item__pic set-bg" 
                                            style={{ backgroundImage: `url('${product.mainImage || product.image || '/src/assets/img/product/product-1.jpg'}')` }}>
                                            {product.is_new && <div className="label new">New</div>}
                                            {product.is_sale && <div className="label sale">Sale</div>}
                                            <ul className="product__hover">
                                                <li><a href={product.mainImage || product.image || '/src/assets/img/product/product-1.jpg'} className="image-popup"><span className="arrow_expand"></span></a></li>
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
                                                        <span className={addingToWishlist[product.id] ? "fa fa-spinner fa-spin" : "icon_heart_alt"}></span>
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
                                                        <span className={addingToSavedItems[product.id] ? "fa fa-spinner fa-spin" : "icon_bookmark_alt"}></span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a 
                                                        href="#" 
                                                        onClick={(e) => handleAddToCart(product, e)}
                                                        style={{ 
                                                            opacity: addingToCart[product.id] ? 0.6 : 1,
                                                            pointerEvents: addingToCart[product.id] ? 'none' : 'auto'
                                                        }}
                                                    >
                                                        <span className={addingToCart[product.id] ? "fa fa-spinner fa-spin" : "icon_bag_alt"}></span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="product__item__text">
                                            <h6><Link to={`/shop/product-details/${product.id}`}>{product.name}</Link></h6>
                                            <div className="rating">
                                                {[...Array(Math.floor(product.rating || 5))].map((_, i) => (
                                                    <i key={i} className="fa fa-star"></i>
                                                ))}
                                                {(product.rating || 5) % 1 > 0 && <i className="fa fa-star-half-o"></i>}
                                            </div>
                                            <div className="product__price">
                                                ${product.price?.toFixed(2) || '0.00'} 
                                                {product.old_price && <span>${product.old_price.toFixed(2)}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
            {/* Product Section End */}

            {/* Banner Section Begin */}
            <section className="banner set-bg" style={{ backgroundImage: "url('/src/assets/img/banner/banner-1.jpg')" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-7 col-lg-8 m-auto">
                            <div className="banner__slider owl-carousel">
                                <div className="banner__item">
                                    <div className="banner__text">
                                        <span>The Atelier Noir Collection</span>
                                        <h1>Luxury Redefined</h1>
                                        <p>Discover our exclusive collection of luxury fashion items, crafted with precision and unparalleled attention to detail.</p>
                                        <Link to="/shop/category">Shop now</Link>
                                    </div>
                                </div>
                                <div className="banner__item">
                                    <div className="banner__text">
                                        <span>Premium Quality</span>
                                        <h1>Exotic Elegance</h1>
                                        <p>Experience the finest materials and craftsmanship in every piece of our curated collection.</p>
                                        <Link to="/shop/category">Shop now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Banner Section End */}

            {/* Trend Section Begin */}
            <section className="trend spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="trend__content">
                                <div className="section-title">
                                    <h4>Hot Trends</h4>
                                </div>
                                {trendLoading ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-dark" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    [...Array(3)].map((_, index) => 
                                        renderTrendItem(trendingProducts[index], index, 'ht')
                                    )
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="trend__content">
                                <div className="section-title">
                                    <h4>Best Sellers</h4>
                                </div>
                                {trendLoading ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-dark" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    [...Array(3)].map((_, index) => 
                                        renderTrendItem(bestSellersProducts[index], index, 'bs')
                                    )
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="trend__content">
                                <div className="section-title">
                                    <h4>Featured</h4>
                                </div>
                                {trendLoading ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-dark" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    [...Array(3)].map((_, index) => 
                                        renderTrendItem(featuredProducts[index], index, 'f')
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Trend Section End */}

            {/* Discount Section Begin */}
            <section className="discount">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 p-0">
                            <div className="discount__pic">
                                <img src="/src/assets/img/discount.jpg" alt="Exclusive Discount" />
                            </div>
                        </div>
                        <div className="col-lg-6 p-0">
                            <div className="discount__text">
                                <div className="discount__text__title">
                                    <span>Exclusive Offer</span>
                                    <h2>Atelier Noir Premium</h2>
                                    <h5><span>Discount</span> 30%</h5>
                                </div>
                                <div className="discount__countdown" id="countdown-time">
                                    <div className="countdown__item">
                                        <span>22</span>
                                        <p>Days</p>
                                    </div>
                                    <div className="countdown__item">
                                        <span>18</span>
                                        <p>Hour</p>
                                    </div>
                                    <div className="countdown__item">
                                        <span>46</span>
                                        <p>Min</p>
                                    </div>
                                    <div className="countdown__item">
                                        <span>05</span>
                                        <p>Sec</p>
                                    </div>
                                </div>
                                <Link to="/shop/category">Shop now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Discount Section End */}

            {/* Services Section Begin */}
            <section className="services spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="services__item">
                                <i className="fa fa-car"></i>
                                <h6>Free Shipping</h6>
                                <p>For all orders over $99</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="services__item">
                                <i className="fa fa-money"></i>
                                <h6>Money Back Guarantee</h6>
                                <p>If goods have problems</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="services__item">
                                <i className="fa fa-support"></i>
                                <h6>Online Support 24/7</h6>
                                <p>Dedicated support</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="services__item">
                                <i className="fa fa-headphones"></i>
                                <h6>Payment Secure</h6>
                                <p>100% secure payment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Services Section End */}
        </>
    );
};

export default Home;