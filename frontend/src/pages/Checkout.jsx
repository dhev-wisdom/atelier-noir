import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
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
        password: '',
        orderNotes: '',
        createAccount: false,
        noteAboutOrder: false,
        checkPayment: true,
        paypal: false
    });

    // Sample order items
    const orderItems = [
        { id: 1, name: "Chain buck bag", price: 300.0 },
        { id: 2, name: "Zip-pockets pebbled tote briefcase", price: 170.0 },
        { id: 3, name: "Black jean", price: 170.0 },
        { id: 4, name: "Cotton shirt", price: 110.0 }
    ];

    useEffect(() => {
        document.title = "Checkout | Ashion";
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would process the checkout here
        console.log('Form submitted:', formData);
        // Redirect to confirmation page or process payment
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((total, item) => total + item.price, 0);
    };

    const subtotal = calculateSubtotal();
    const total = subtotal; // In a real app, you might add shipping, tax, etc.

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
                                <span className="icon_tag_alt"></span> <a href="#">Have a coupon?</a> Click
                                here to enter your code.
                            </h6>
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
                                            {orderItems.map((item, index) => (
                                                <li key={item.id}>
                                                    {`${(index + 1).toString().padStart(2, '0')}. ${item.name}`} 
                                                    <span>$ {item.price.toFixed(1)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="checkout__order__total">
                                        <ul>
                                            <li>Subtotal <span>$ {subtotal.toFixed(1)}</span></li>
                                            <li>Total <span>$ {total.toFixed(1)}</span></li>
                                        </ul>
                                    </div>
                                    <div className="checkout__order__widget">
                                        <label htmlFor="check-payment">
                                            Cheque payment
                                            <input 
                                                type="checkbox" 
                                                id="check-payment"
                                                name="checkPayment"
                                                checked={formData.checkPayment}
                                                onChange={handleInputChange}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="paypal">
                                            PayPal
                                            <input 
                                                type="checkbox" 
                                                id="paypal"
                                                name="paypal"
                                                checked={formData.paypal}
                                                onChange={handleInputChange}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <button type="submit" className="site-btn">Place order</button>
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