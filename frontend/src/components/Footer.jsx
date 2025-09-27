import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-7">
                        <div className="footer__about">
                            <div className="footer__logo">
                                <Link to="/"><img src="/img/logo.png" alt="" /></Link>
                            </div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            cilisis.</p>
                            <div className="footer__payment">
                                <Link to="#"><img src="/img/payment/payment-1.png" alt="" /></Link>
                                <Link to="#"><img src="/img/payment/payment-2.png" alt="" /></Link>
                                <Link to="#"><img src="/img/payment/payment-3.png" alt="" /></Link>
                                <Link to="#"><img src="/img/payment/payment-4.png" alt="" /></Link>
                                <Link to="#"><img src="/img/payment/payment-5.png" alt="" /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-5">
                        <div className="footer__widget">
                            <h6>Quick links</h6>
                            <ul>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/blog">Blogs</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4">
                        <div className="footer__widget">
                            <h6>Account</h6>
                            <ul>
                                <li><Link to="/account">My Account</Link></li>
                                <li><Link to="/orders">Orders Tracking</Link></li>
                                <li><Link to="/checkout">Checkout</Link></li>
                                <li><Link to="/wishlist">Wishlist</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-8 col-sm-8">
                        <div className="footer__newslatter">
                            <h6>NEWSLETTER</h6>
                            <form action="#">
                                <input type="text" placeholder="Email" />
                                <button type="submit" className="site-btn">Subscribe</button>
                            </form>
                            <div className="footer__social">
                                <Link to="#"><i className="fa fa-facebook"></i></Link>
                                <Link to="#"><i className="fa fa-twitter"></i></Link>
                                <Link to="#"><i className="fa fa-youtube-play"></i></Link>
                                <Link to="#"><i className="fa fa-instagram"></i></Link>
                                <Link to="#"><i className="fa fa-pinterest"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="footer__copyright__text">
                            <p>Copyright &copy; {new Date().getFullYear()} All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;