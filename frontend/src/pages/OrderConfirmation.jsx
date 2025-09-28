import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import OrderService from '../utils/orderService';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(!order);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = "Order Confirmation | Atelier Noir";
        window.scrollTo(0, 0);

        // If order data wasn't passed via state, fetch it
        if (!order && orderId) {
            fetchOrder();
        }
    }, [orderId, order]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const orderData = await OrderService.getOrderById(orderId);
            setOrder(orderData);
        } catch (error) {
            console.error('Error fetching order:', error);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="loading-spinner">
                    <i className="fa fa-spinner fa-spin fa-3x"></i>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="error-message">
                    <i className="fa fa-exclamation-triangle fa-3x" style={{ color: '#dc3545', marginBottom: '20px' }}></i>
                    <h3>Order Not Found</h3>
                    <p>{error || 'The order you are looking for could not be found.'}</p>
                    <Link to="/" className="site-btn">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb Begin */}
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <span>Order Confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Order Confirmation Section Begin */}
            <section className="order-confirmation spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="order-confirmation__content">
                                {/* Success Message */}
                                <div className="order-success" style={{ textAlign: 'center', marginBottom: '50px' }}>
                                    <i className="fa fa-check-circle fa-5x" style={{ color: '#28a745', marginBottom: '20px' }}></i>
                                    <h2>Order Placed Successfully!</h2>
                                    <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                                    <div className="order-number">
                                        <h4>Order Number: <span style={{ color: '#ca1515' }}>#{order.id}</span></h4>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Order Details */}
                                    <div className="col-lg-8">
                                        <div className="order-details">
                                            <h5>Order Details</h5>
                                            <div className="order-info">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p><strong>Order Date:</strong> {new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                                                        <p><strong>Payment Method:</strong> {order.payment_method || 'Card'}</p>
                                                        <p><strong>Order Status:</strong> 
                                                            <span className={`status ${order.status || 'pending'}`} style={{ 
                                                                marginLeft: '10px', 
                                                                padding: '5px 10px', 
                                                                borderRadius: '15px',
                                                                backgroundColor: '#f8f9fa',
                                                                color: '#495057',
                                                                fontSize: '12px',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {order.status || 'Pending'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        {order.shipping_address && (
                                                            <>
                                                                <p><strong>Shipping Address:</strong></p>
                                                                <address style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                                                    {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                                                                    {order.shipping_address.address}<br />
                                                                    {order.shipping_address.address_optional && (
                                                                        <>{order.shipping_address.address_optional}<br /></>
                                                                    )}
                                                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}<br />
                                                                    {order.shipping_address.country}<br />
                                                                    {order.shipping_address.phone}
                                                                </address>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="order-items" style={{ marginTop: '30px' }}>
                                                <h5>Items Ordered</h5>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Product</th>
                                                                <th>Quantity</th>
                                                                <th>Price</th>
                                                                <th>Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items && order.items.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="product-info">
                                                                            <strong>{item.product_name || item.name}</strong>
                                                                            {item.size && <div><small>Size: {item.size}</small></div>}
                                                                            {item.color && <div><small>Color: {item.color}</small></div>}
                                                                        </div>
                                                                    </td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>${item.price?.toFixed(2)}</td>
                                                                    <td>${(item.price * item.quantity)?.toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="col-lg-4">
                                        <div className="order-summary">
                                            <h5>Order Summary</h5>
                                            <div className="summary-details">
                                                <div className="summary-row">
                                                    <span>Subtotal:</span>
                                                    <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                {order.discount > 0 && (
                                                    <div className="summary-row">
                                                        <span>Discount:</span>
                                                        <span style={{ color: 'green' }}>-${order.discount?.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="summary-row">
                                                    <span>Shipping:</span>
                                                    <span>Free</span>
                                                </div>
                                                <div className="summary-row total">
                                                    <strong>
                                                        <span>Total:</span>
                                                        <span>${order.total?.toFixed(2) || '0.00'}</span>
                                                    </strong>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="order-actions" style={{ marginTop: '30px' }}>
                                                <Link to="/orders" className="site-btn" style={{ width: '100%', marginBottom: '10px' }}>
                                                    View All Orders
                                                </Link>
                                                <Link to="/" className="site-btn site-btn-outline" style={{ width: '100%' }}>
                                                    Continue Shopping
                                                </Link>
                                            </div>

                                            {/* Order Notes */}
                                            {order.order_notes && (
                                                <div className="order-notes" style={{ marginTop: '20px' }}>
                                                    <h6>Order Notes:</h6>
                                                    <p style={{ fontSize: '14px', fontStyle: 'italic' }}>
                                                        {order.order_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="row" style={{ marginTop: '50px' }}>
                                    <div className="col-lg-12">
                                        <div className="additional-info" style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '5px',
                                            textAlign: 'center'
                                        }}>
                                            <h6>What's Next?</h6>
                                            <p>
                                                You will receive an email confirmation shortly with your order details and tracking information.
                                                We'll notify you when your order ships and provide tracking details.
                                            </p>
                                            <p>
                                                <strong>Questions about your order?</strong> 
                                                <Link to="/contact" style={{ marginLeft: '5px' }}>Contact our support team</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Order Confirmation Section End */}

            <style jsx>{`
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                }
                .summary-row.total {
                    border-top: 1px solid #dee2e6;
                    padding-top: 10px;
                    margin-top: 10px;
                }
                .site-btn-outline {
                    background: transparent;
                    color: #ca1515;
                    border: 1px solid #ca1515;
                }
                .site-btn-outline:hover {
                    background: #ca1515;
                    color: white;
                }
            `}</style>
        </>
    );
};

export default OrderConfirmation;