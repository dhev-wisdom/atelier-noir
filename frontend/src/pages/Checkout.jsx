import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import OrderService from '../utils/orderService';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        country: '',
        address: '',
        addressOptional: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        orderNotes: '',
        createAccount: false,
        noteAboutOrder: false,
        paymentMethod: 'card'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [showCouponForm, setShowCouponForm] = useState(false);

    useEffect(() => {
        document.title = "Checkout | Atelier Noir";
        window.scrollTo(0, 0);
        
        // Redirect to cart if no items
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;
        
        try {
            // In a real app, you would validate the coupon with the backend
            // For now, we'll simulate a 10% discount for demo purposes
            if (couponCode.toLowerCase() === 'save10') {
                setCouponDiscount(0.1);
                setError('');
            } else {
                setError('Invalid coupon code');
                setCouponDiscount(0);
            }
        } catch (error) {
            setError('Error applying coupon');
            setCouponDiscount(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare shipping address
            const shippingAddress = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address: formData.address,
                address_optional: formData.addressOptional,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zipCode,
                country: formData.country,
                phone: formData.phone,
                email: formData.email
            };

            // Prepare order data
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    price: item.price
                })),
                shipping_address: shippingAddress,
                payment_method: formData.paymentMethod,
                order_notes: formData.orderNotes,
                coupon_code: couponCode || null,
                subtotal: getCartTotal(),
                discount: couponDiscount * getCartTotal(),
                total: getCartTotal() * (1 - couponDiscount)
            };

            // Create the order
            const order = await OrderService.createOrder(orderData);
            
            // Clear the cart after successful order
            clearCart();
            
            // Redirect to order confirmation page
            navigate(`/order-confirmation/${order.id}`, { 
                state: { order, orderData } 
            });

        } catch (error) {
            console.error('Error creating order:', error);
            setError('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return getCartTotal();
    };

    const calculateDiscount = () => {
        return couponDiscount * getCartTotal();
    };

    const calculateTotal = () => {
        return getCartTotal() * (1 - couponDiscount);
    };

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    return (
        <>
            {/* Breadcrumb Begin */}
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <span>Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Checkout Section Begin */}
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h6 className="coupon__link">
                                <span className="icon_tag_alt"></span> 
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setShowCouponForm(!showCouponForm);
                                }}>
                                    Have a coupon?
                                </a> Click here to enter your code.
                            </h6>
                            {showCouponForm && (
                                <div className="coupon__form">
                                    <form onSubmit={handleCouponSubmit}>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <input 
                                                    type="text" 
                                                    placeholder="Coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <button type="submit" className="site-btn">Apply Coupon</button>
                                            </div>
                                        </div>
                                    </form>
                                    {couponDiscount > 0 && (
                                        <div className="coupon__success">
                                            <p style={{color: 'green', marginTop: '10px'}}>
                                                Coupon applied! You saved ${discount.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger" style={{marginTop: '10px'}}>
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="checkout__form">
                        <div className="row">
                            <div className="col-lg-8">
                                <h5>Billing detail</h5>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>First Name <span>*</span></p>
                                            <input 
                                                type="text" 
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Last Name <span>*</span></p>
                                            <input 
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>Country <span>*</span></p>
                                            <input 
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Address <span>*</span></p>
                                            <input 
                                                type="text" 
                                                placeholder="Street Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Apartment, suite, unit etc. (optional)"
                                                name="addressOptional"
                                                value={formData.addressOptional}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Town/City <span>*</span></p>
                                            <input 
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Country/State <span>*</span></p>
                                            <input 
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Postcode/Zip <span>*</span></p>
                                            <input 
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Phone <span>*</span></p>
                                            <input 
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Email <span>*</span></p>
                                            <input 
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="checkout__form__checkbox">
                                            <label htmlFor="acc">
                                                Create an account?
                                                <input 
                                                    type="checkbox" 
                                                    id="acc"
                                                    name="createAccount"
                                                    checked={formData.createAccount}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <p>Create an account by entering the information below. If you are a returning
                                                customer login at the top of the page</p>
                                        </div>
                                        {formData.createAccount && (
                                            <div className="checkout__form__input">
                                                <p>Account Password <span>*</span></p>
                                                <input 
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        )}
                                        <div className="checkout__form__checkbox">
                                            <label htmlFor="note">
                                                Note about your order, e.g., special note for delivery
                                                <input 
                                                    type="checkbox" 
                                                    id="note"
                                                    name="noteAboutOrder"
                                                    checked={formData.noteAboutOrder}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        {formData.noteAboutOrder && (
                                            <div className="checkout__form__input">
                                                <p>Order notes <span>*</span></p>
                                                <input 
                                                    type="text"
                                                    name="orderNotes"
                                                    value={formData.orderNotes}
                                                    onChange={handleInputChange}
                                                    placeholder="Notes about your order, e.g., special note for delivery"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="checkout__order">
                                    <h5>Your order</h5>
                                    <div className="checkout__order__product">
                                        <ul>
                                            <li>
                                                <span className="top__text">Product</span>
                                                <span className="top__text__right">Total</span>
                                            </li>
                                            {cartItems.map((item, index) => (
                                                <li key={`${item.id}-${item.size}-${item.color}`}>
                                                    {`${(index + 1).toString().padStart(2, '0')}. ${item.name}`}
                                                    {item.size && <span className="product-variant"> - Size: {item.size}</span>}
                                                    {item.color && <span className="product-variant"> - Color: {item.color}</span>}
                                                    <span className="product-quantity"> x{item.quantity}</span>
                                                    <span>$ {(item.price * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="checkout__order__total">
                                        <ul>
                                            <li>Subtotal <span>$ {subtotal.toFixed(2)}</span></li>
                                            {couponDiscount > 0 && (
                                                <li>Discount <span style={{color: 'green'}}>- $ {discount.toFixed(2)}</span></li>
                                            )}
                                            <li>Total <span>$ {total.toFixed(2)}</span></li>
                                        </ul>
                                    </div>
                                    <div className="checkout__order__widget">
                                        <label htmlFor="card-payment">
                                            Credit/Debit Card
                                            <input 
                                                type="radio" 
                                                id="card-payment"
                                                name="paymentMethod"
                                                value="card"
                                                checked={formData.paymentMethod === 'card'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="paypal">
                                            PayPal
                                            <input 
                                                type="radio" 
                                                id="paypal"
                                                name="paymentMethod"
                                                value="paypal"
                                                checked={formData.paymentMethod === 'paypal'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="bank-transfer">
                                            Bank Transfer
                                            <input 
                                                type="radio" 
                                                id="bank-transfer"
                                                name="paymentMethod"
                                                value="bank_transfer"
                                                checked={formData.paymentMethod === 'bank_transfer'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="site-btn"
                                        disabled={loading || cartItems.length === 0}
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            {/* Checkout Section End */}
        </>
    );
};

export default Checkout;