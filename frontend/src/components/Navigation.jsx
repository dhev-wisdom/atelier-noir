import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSavedItems } from '../contexts/SavedItemsContext';
import CategoryService from '../utils/categoryService';

const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { currentUser, logout, isAuthenticated } = useAuth();
    const { getCartItemsCount } = useCart();
    const { getWishlistCount } = useWishlist();
    const { getSavedItemsCount } = useSavedItems();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            console.log('Navigation categories API response:', categoriesData);
            
            // Handle paginated response - extract results array
            const categories = categoriesData.results || categoriesData || [];
            setCategories(categories.slice(0, 6)); // Limit to 6 categories for navigation
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <>
            {/* Offcanvas Menu Begin */}
            <div className={`offcanvas-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}></div>
            <div className={`offcanvas-menu-wrapper ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="offcanvas__close" onClick={toggleMobileMenu}>+</div>
                <ul className="offcanvas__widget">
                    <li><span className="icon_search search-switch"></span></li>
                    <li><Link to="/wishlist"><span className="icon_heart_alt"></span>
                        <div className="tip">{getWishlistCount()}</div>
                    </Link></li>
                    <li><Link to="/cart"><span className="icon_bag_alt"></span>
                        <div className="tip">{getCartItemsCount()}</div>
                    </Link></li>
                </ul>
                <div className="offcanvas__logo">
                    <Link to="/"><img src="/src/assets/img/logo.png" alt="Atelier Noir Logo" /></Link>
                </div>
                <div id="mobile-menu-wrap"></div>
                <div className="offcanvas__auth">
                    {isAuthenticated ? (
                        <>
                            <span>Hello, {currentUser?.first_name || 'User'}</span>
                            <a href="#" onClick={handleLogout}>Logout</a>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Register</Link>
                        </>
                    )}
                </div>
            </div>
            {/* Offcanvas Menu End */}

            {/* Header Section Begin */}
            <header className="header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-3 col-lg-2">
                            <div className="header__logo">
                                <Link to="/"><img src="/src/assets/img/logo.png" alt="Atelier Noir Logo" /></Link>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <nav className="header__menu">
                                <ul>
                                    <li className="active"><Link to="/">Home</Link></li>
                                    <li><Link to="/category">Shop</Link>
                                        <ul className="dropdown">
                                            <li><Link to="/category">All Products</Link></li>
                                            {categories.map(category => (
                                                <li key={category.id}>
                                                    <Link to={`/category/${category.slug || category.id}`}>
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__right">
                                <div className="header__right__auth">
                                    {isAuthenticated ? (
                                        <>
                                            <span>Hello, {currentUser?.first_name || 'User'}</span>
                                            <a href="#" onClick={handleLogout}>Logout</a>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login">Login</Link>
                                            <Link to="/signup">Register</Link>
                                        </>
                                    )}
                                </div>
                                <ul className="header__right__widget">
                                    <li><span className="icon_search search-switch"></span></li>
                                    {isAuthenticated && (
                                        <li><Link to="/saved-items"><span className="icon_bookmark_alt"></span>
                                            <div className="tip">{getSavedItemsCount()}</div>
                                        </Link></li>
                                    )}
                                    <li><Link to="/wishlist"><span className="icon_heart_alt"></span>
                                        <div className="tip">{getWishlistCount()}</div>
                                    </Link></li>
                                    <li><Link to="/cart"><span className="icon_bag_alt"></span>
                                        <div className="tip">{getCartItemsCount()}</div>
                                    </Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="canvas__open" onClick={toggleMobileMenu}>
                        <i className="fa fa-bars"></i>
                    </div>
                </div>
            </header>
            {/* Header Section End */}
        </>
    );
};

export default Navigation;