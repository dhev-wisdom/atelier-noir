import { Link } from 'react-router-dom';
import { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            // Here you would typically send the email to your API
            console.log('Newsletter subscription:', email);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-7">
                        <div className="footer__about">
                            <div className="footer__logo">
                                <Link to="/">
                                    <h2 style={{ 
                                        color: '#ca1515', 
                                        fontFamily: 'Playfair Display, serif',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        fontSize: '2rem'
                                    }}>
                                        Atelier Noir
                                    </h2>
                                </Link>
                            </div>
                            <p style={{ 
                                color: '#666', 
                                lineHeight: '1.6',
                                marginTop: '15px',
                                fontSize: '14px'
                            }}>
                                Discover timeless elegance and contemporary style at Atelier Noir. 
                                We curate premium fashion pieces that define sophistication and luxury.
                            </p>
                            <div className="footer__payment">
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '10px', 
                                    alignItems: 'center',
                                    marginTop: '20px'
                                }}>
                                    <span style={{ 
                                        fontSize: '12px', 
                                        color: '#999',
                                        marginRight: '10px'
                                    }}>
                                        We Accept:
                                    </span>
                                    <div style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        color: '#333'
                                    }}>
                                        VISA
                                    </div>
                                    <div style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        color: '#333'
                                    }}>
                                        MASTERCARD
                                    </div>
                                    <div style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        color: '#333'
                                    }}>
                                        PAYPAL
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-5">
                        <div className="footer__widget">
                            <h6 style={{ 
                                color: '#333', 
                                fontWeight: '600',
                                marginBottom: '20px',
                                fontSize: '16px'
                            }}>
                                Quick Links
                            </h6>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/about" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        About Us
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/shop" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        Shop
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/contact" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        Contact
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/faq" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4">
                        <div className="footer__widget">
                            <h6 style={{ 
                                color: '#333', 
                                fontWeight: '600',
                                marginBottom: '20px',
                                fontSize: '16px'
                            }}>
                                Customer Care
                            </h6>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/account" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        My Account
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/orders" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        Order Tracking
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/wishlist" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        Wishlist
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <Link to="/returns" style={{ 
                                        color: '#666', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        Returns & Exchanges
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-8 col-sm-8">
                        <div className="footer__newslatter">
                            <h6 style={{ 
                                color: '#333', 
                                fontWeight: '600',
                                marginBottom: '20px',
                                fontSize: '16px'
                            }}>
                                NEWSLETTER
                            </h6>
                            <p style={{ 
                                color: '#666', 
                                fontSize: '14px',
                                marginBottom: '15px',
                                lineHeight: '1.5'
                            }}>
                                Subscribe to get updates on new arrivals, exclusive offers, and fashion trends.
                            </p>
                            <form onSubmit={handleNewsletterSubmit} style={{ marginBottom: '20px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            flex: 1,
                                            padding: '12px 15px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                    />
                                    <button 
                                        type="submit" 
                                        className="site-btn"
                                        style={{
                                            backgroundColor: '#ca1515',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 20px',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                {subscribed && (
                                    <p style={{ 
                                        color: '#28a745', 
                                        fontSize: '12px',
                                        margin: 0
                                    }}>
                                        ✓ Thank you for subscribing!
                                    </p>
                                )}
                            </form>
                            <div className="footer__social">
                                <h6 style={{ 
                                    color: '#333', 
                                    fontWeight: '600',
                                    marginBottom: '15px',
                                    fontSize: '14px'
                                }}>
                                    Follow Us
                                </h6>
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '15px',
                                    alignItems: 'center'
                                }}>
                                    <Link 
                                        to="#" 
                                        style={{ 
                                            color: '#666',
                                            fontSize: '18px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ca1515'}
                                        onMouseLeave={(e) => e.target.style.color = '#666'}
                                    >
                                        <i className="fa fa-facebook"></i>
                                    </Link>
                                    <Link 
                                        to="#" 
                                        style={{ 
                                            color: '#666',
                                            fontSize: '18px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ca1515'}
                                        onMouseLeave={(e) => e.target.style.color = '#666'}
                                    >
                                        <i className="fa fa-twitter"></i>
                                    </Link>
                                    <Link 
                                        to="#" 
                                        style={{ 
                                            color: '#666',
                                            fontSize: '18px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ca1515'}
                                        onMouseLeave={(e) => e.target.style.color = '#666'}
                                    >
                                        <i className="fa fa-instagram"></i>
                                    </Link>
                                    <Link 
                                        to="#" 
                                        style={{ 
                                            color: '#666',
                                            fontSize: '18px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ca1515'}
                                        onMouseLeave={(e) => e.target.style.color = '#666'}
                                    >
                                        <i className="fa fa-pinterest"></i>
                                    </Link>
                                    <Link 
                                        to="#" 
                                        style={{ 
                                            color: '#666',
                                            fontSize: '18px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ca1515'}
                                        onMouseLeave={(e) => e.target.style.color = '#666'}
                                    >
                                        <i className="fa fa-youtube-play"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="footer__copyright__text">
                            <div style={{ 
                                borderTop: '1px solid #eee',
                                paddingTop: '20px',
                                textAlign: 'center'
                            }}>
                                <p style={{ 
                                    color: '#666',
                                    fontSize: '14px',
                                    margin: 0,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    <span>
                                        Copyright &copy; {currentYear} Atelier Noir. All rights reserved.
                                    </span>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '20px',
                                        fontSize: '12px'
                                    }}>
                                        <Link 
                                            to="/privacy" 
                                            style={{ 
                                                color: '#666', 
                                                textDecoration: 'none',
                                                transition: 'color 0.3s ease'
                                            }}
                                        >
                                            Privacy Policy
                                        </Link>
                                        <Link 
                                            to="/terms" 
                                            style={{ 
                                                color: '#666', 
                                                textDecoration: 'none',
                                                transition: 'color 0.3s ease'
                                            }}
                                        >
                                            Terms of Service
                                        </Link>
                                        <Link 
                                            to="/shipping" 
                                            style={{ 
                                                color: '#666', 
                                                textDecoration: 'none',
                                                transition: 'color 0.3s ease'
                                            }}
                                        >
                                            Shipping Info
                                        </Link>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;