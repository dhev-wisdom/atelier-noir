import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        // Set document title
        document.title = "Ashion | Home";
    }, []);

    return (
        <>
            {/* Categories Section Begin */}
            <section className="categories">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 p-0">
                            <div className="categories__item categories__large__item"
                                style={{ backgroundImage: "url('/img/categories/category-1.jpg')" }}>
                                <div className="categories__text">
                                    <h1>Women's fashion</h1>
                                    <p>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore
                                    edolore magna aliquapendisse ultrices gravida.</p>
                                    <Link to="/category/women">Shop now</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item" 
                                        style={{ backgroundImage: "url('/img/categories/category-2.jpg')" }}>
                                        <div className="categories__text">
                                            <h4>Men's fashion</h4>
                                            <p>358 items</p>
                                            <Link to="/category/men">Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item" 
                                        style={{ backgroundImage: "url('/img/categories/category-3.jpg')" }}>
                                        <div className="categories__text">
                                            <h4>Kid's fashion</h4>
                                            <p>273 items</p>
                                            <Link to="/category/kids">Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item" 
                                        style={{ backgroundImage: "url('/img/categories/category-4.jpg')" }}>
                                        <div className="categories__text">
                                            <h4>Cosmetics</h4>
                                            <p>159 items</p>
                                            <Link to="/category/cosmetics">Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item" 
                                        style={{ backgroundImage: "url('/img/categories/category-5.jpg')" }}>
                                        <div className="categories__text">
                                            <h4>Accessories</h4>
                                            <p>792 items</p>
                                            <Link to="/category/accessories">Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <h4>New product</h4>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                            <ul className="filter__controls">
                                <li className="active" data-filter="*">All</li>
                                <li data-filter=".women">Women's</li>
                                <li data-filter=".men">Men's</li>
                                <li data-filter=".kid">Kid's</li>
                                <li data-filter=".accessories">Accessories</li>
                                <li data-filter=".cosmetic">Cosmetics</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row property__gallery">
                        {/* Product items - These would typically come from an API */}
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div key={item} className="col-lg-3 col-md-4 col-sm-6 mix women">
                                <div className="product__item">
                                    <div className="product__item__pic" 
                                        style={{ backgroundImage: `url('/img/product/product-${item}.jpg')` }}>
                                        {item === 1 && <div className="label new">New</div>}
                                        {item === 6 && <div className="label sale">Sale</div>}
                                        <ul className="product__hover">
                                            <li><a href={`/img/product/product-${item}.jpg`} className="image-popup"><span className="arrow_expand"></span></a></li>
                                            <li><Link to="/wishlist"><span className="icon_heart_alt"></span></Link></li>
                                            <li><Link to="/cart"><span className="icon_bag_alt"></span></Link></li>
                                        </ul>
                                    </div>
                                    <div className="product__item__text">
                                        <h6><Link to={`/product/${item}`}>Product Name {item}</Link></h6>
                                        <div className="rating">
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="product__price">$ {49 + item}.0 {item === 6 && <span>$ 59.0</span>}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Product Section End */}

            {/* Banner Section Begin */}
            <section className="banner" style={{ backgroundImage: "url('/img/banner/banner-1.jpg')" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-7 col-lg-8 m-auto">
                            <div className="banner__slider">
                                <div className="banner__item">
                                    <div className="banner__text">
                                        <span>The Chloe Collection</span>
                                        <h1>The Project Jacket</h1>
                                        <Link to="/shop">Shop now</Link>
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
                                    <h4>Hot Trend</h4>
                                </div>
                                {[1, 2, 3].map((item) => (
                                    <div key={`trend-${item}`} className="trend__item">
                                        <div className="trend__item__pic">
                                            <img src={`/img/trend/ht-${item}.jpg`} alt="" />
                                        </div>
                                        <div className="trend__item__text">
                                            <h6>Hot Trend Item {item}</h6>
                                            <div className="rating">
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                            <div className="product__price">$ {39 + item}.0</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="trend__content">
                                <div className="section-title">
                                    <h4>Best seller</h4>
                                </div>
                                {[1, 2, 3].map((item) => (
                                    <div key={`bs-${item}`} className="trend__item">
                                        <div className="trend__item__pic">
                                            <img src={`/img/trend/bs-${item}.jpg`} alt="" />
                                        </div>
                                        <div className="trend__item__text">
                                            <h6>Best Seller Item {item}</h6>
                                            <div className="rating">
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                            <div className="product__price">$ {59 + item}.0</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="trend__content">
                                <div className="section-title">
                                    <h4>Feature</h4>
                                </div>
                                {[1, 2, 3].map((item) => (
                                    <div key={`f-${item}`} className="trend__item">
                                        <div className="trend__item__pic">
                                            <img src={`/img/trend/f-${item}.jpg`} alt="" />
                                        </div>
                                        <div className="trend__item__text">
                                            <h6>Featured Item {item}</h6>
                                            <div className="rating">
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                            <div className="product__price">$ {49 + item}.0</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Trend Section End */}
        </>
    );
};

export default Home;