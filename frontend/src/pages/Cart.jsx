import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Chain bucket bag",
            price: 150.0,
            quantity: 1,
            image: "/assets/img/shop-cart/cp-1.jpg",
            rating: 5
        },
        {
            id: 2,
            name: "Zip-pockets pebbled tote briefcase",
            price: 170.0,
            quantity: 1,
            image: "/assets/img/shop-cart/cp-2.jpg",
            rating: 5
        },
        {
            id: 3,
            name: "Black jean",
            price: 85.0,
            quantity: 1,
            image: "/assets/img/shop-cart/cp-3.jpg",
            rating: 5
        },
        {
            id: 4,
            name: "Cotton Shirt",
            price: 55.0,
            quantity: 1,
            image: "/assets/img/shop-cart/cp-4.jpg",
            rating: 5
        }
    ]);
    
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        document.title = "Shopping Cart | Ashion";
        window.scrollTo(0, 0);
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity > 0) {
            setCartItems(cartItems.map(item => 
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
                                <span>Shopping cart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Shop Cart Section Begin */}
            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shop__cart__table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="cart__product__item">
                                                    <img src={item.image} alt={item.name} />
                                                    <div className="cart__product__item__title">
                                                        <h6>{item.name}</h6>
                                                        <div className="rating">
                                                            {[...Array(item.rating)].map((_, i) => (
                                                                <i className="fa fa-star" key={i}></i>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="cart__price">$ {item.price.toFixed(1)}</td>
                                                <td className="cart__quantity">
                                                    <div className="pro-qty">
                                                        <span 
                                                            className="dec qtybtn" 
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        >-</span>
                                                        <input type="text" value={item.quantity} readOnly />
                                                        <span 
                                                            className="inc qtybtn" 
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        >+</span>
                                                    </div>
                                                </td>
                                                <td className="cart__total">$ {(item.price * item.quantity).toFixed(1)}</td>
                                                <td className="cart__close">
                                                    <span className="icon_close" onClick={() => handleRemoveItem(item.id)}></span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="cart__btn">
                                <Link to="/shop">Continue Shopping</Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="cart__btn update__btn">
                                <a href="#"><span className="icon_loading"></span> Update cart</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="discount__content">
                                <h6>Discount codes</h6>
                                <form action="#">
                                    <input 
                                        type="text" 
                                        placeholder="Enter your coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button type="submit" className="site-btn">Apply</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-4 offset-lg-2">
                            <div className="cart__total__procced">
                                <h6>Cart total</h6>
                                <ul>
                                    <li>Subtotal <span>$ {subtotal.toFixed(1)}</span></li>
                                    <li>Total <span>$ {total.toFixed(1)}</span></li>
                                </ul>
                                <Link to="/checkout" className="primary-btn">Proceed to checkout</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Shop Cart Section End */}
        </>
    );
};

export default Cart;