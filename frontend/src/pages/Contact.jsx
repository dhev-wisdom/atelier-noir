import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = "Contact Us | Atelier Noir";
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                website: '',
                message: ''
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Breadcrumb Begin */}
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <span>Contact</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Contact Section Begin */}
            <section className="contact spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="contact__content">
                                <div className="contact__address">
                                    <h5>Contact info</h5>
                                    <ul>
                                        <li>
                                            <h6><i className="fa fa-map-marker"></i> Address</h6>
                                            <p>123 Fashion Street, Style District, New York, NY 10001</p>
                                        </li>
                                        <li>
                                            <h6><i className="fa fa-phone"></i> Phone</h6>
                                            <p>
                                                <span>+1 (555) 123-4567</span>
                                                <span>+1 (555) 987-6543</span>
                                            </p>
                                        </li>
                                        <li>
                                            <h6><i className="fa fa-headphones"></i> Support</h6>
                                            <p>support@ateliernoir.com</p>
                                        </li>
                                        <li>
                                            <h6><i className="fa fa-clock-o"></i> Business Hours</h6>
                                            <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                                               Saturday: 10:00 AM - 4:00 PM<br />
                                               Sunday: Closed</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="contact__form">
                                    <h5>SEND MESSAGE</h5>
                                    {success && (
                                        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                                            Thank you for your message! We'll get back to you soon.
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                                            {error}
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <input 
                                            type="text" 
                                            name="name"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input 
                                            type="email" 
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            name="website"
                                            placeholder="Website (Optional)"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                        />
                                        <textarea 
                                            name="message"
                                            placeholder="Message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                        <button 
                                            type="submit" 
                                            className="site-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="contact__map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1635959999999!5m2!1sen!2sus"
                                    height="780"
                                    style={{ border: 0, width: '100%' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Atelier Noir Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Contact Section End */}

            {/* Additional Information Section */}
            <section className="contact-info spad" style={{ backgroundColor: '#f8f9fa', paddingTop: '50px', paddingBottom: '50px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h4 style={{ textAlign: 'center', marginBottom: '50px' }}>Why Choose Atelier Noir?</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="contact-info__item" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <i className="fa fa-truck fa-3x" style={{ color: '#ca1515', marginBottom: '20px' }}></i>
                                <h6>Free Shipping</h6>
                                <p>Free shipping on orders over $100</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="contact-info__item" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <i className="fa fa-refresh fa-3x" style={{ color: '#ca1515', marginBottom: '20px' }}></i>
                                <h6>Easy Returns</h6>
                                <p>30-day return policy for all items</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="contact-info__item" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <i className="fa fa-shield fa-3x" style={{ color: '#ca1515', marginBottom: '20px' }}></i>
                                <h6>Secure Payment</h6>
                                <p>Your payment information is safe with us</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="contact-info__item" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <i className="fa fa-headphones fa-3x" style={{ color: '#ca1515', marginBottom: '20px' }}></i>
                                <h6>24/7 Support</h6>
                                <p>Customer support available around the clock</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Additional Information Section End */}
        </>
    );
};

export default Contact;