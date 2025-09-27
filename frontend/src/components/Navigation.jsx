import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
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
                        <div className="tip">2</div>
                    </Link></li>
                    <li><Link to="/cart"><span className="icon_bag_alt"></span>
                        <div className="tip">2</div>
                    </Link></li>
                </ul>
                <div className="offcanvas__logo">
                    <Link to="/"><img src="/src/assets/img/logo.png" alt="Ashion Logo" /></Link>
                </div>
                <div id="mobile-menu-wrap"></div>
                <div className="offcanvas__auth">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </div>
            {/* Offcanvas Menu End */}

            {/* Header Section Begin */}
            <header className="header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-3 col-lg-2">
                            <div className="header__logo">
                                <Link to="/"><img src="/src/assets/img/logo.png" alt="Ashion Logo" /></Link>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <nav className="header__menu">
                                <ul>
                                    <li className="active"><Link to="/">Home</Link></li>
                                    <li><Link to="/category/women">Women's</Link></li>
                                    <li><Link to="/category/men">Men's</Link></li>
                                    <li><Link to="/shop">Shop</Link></li>
                                    <li><Link to="#">Pages</Link>
                                        <ul className="dropdown">
                                            <li><Link to="/product/1">Product Details</Link></li>
                                            <li><Link to="/cart">Shop Cart</Link></li>
                                            <li><Link to="/checkout">Checkout</Link></li>
                                            <li><Link to="/blog/1">Blog Details</Link></li>
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
                                    <Link to="/login">Login</Link>
                                    <Link to="/register">Register</Link>
                                </div>
                                <ul className="header__right__widget">
                                    <li><span className="icon_search search-switch"></span></li>
                                    <li><Link to="/wishlist"><span className="icon_heart_alt"></span>
                                        <div className="tip">2</div>
                                    </Link></li>
                                    <li><Link to="/cart"><span className="icon_bag_alt"></span>
                                        <div className="tip">2</div>
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