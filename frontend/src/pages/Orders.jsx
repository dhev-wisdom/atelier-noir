import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../utils/orderService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        document.title = "My Orders | Atelier Noir";
        window.scrollTo(0, 0);
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await OrderService.getUserOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await OrderService.cancelOrder(orderId);
            // Refresh orders list
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '#ffc107';
            case 'confirmed':
                return '#17a2b8';
            case 'processing':
                return '#007bff';
            case 'shipped':
                return '#6f42c1';
            case 'delivered':
                return '#28a745';
            case 'cancelled':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const canCancelOrder = (status) => {
        return ['pending', 'confirmed'].includes(status?.toLowerCase());
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="loading-spinner">
                    <i className="fa fa-spinner fa-spin fa-3x"></i>
                    <p>Loading your orders...</p>
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
                                <span>My Orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Orders Section Begin */}
            <section className="orders spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="orders__content">
                                <h2>My Orders</h2>
                                
                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                {orders.length === 0 ? (
                                    <div className="empty-orders" style={{ textAlign: 'center', padding: '50px 0' }}>
                                        <i className="fa fa-shopping-bag fa-5x" style={{ color: '#dee2e6', marginBottom: '20px' }}></i>
                                        <h4>No Orders Yet</h4>
                                        <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                                        <Link to="/" className="site-btn">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map((order) => (
                                            <div key={order.id} className="order-card" style={{
                                                border: '1px solid #dee2e6',
                                                borderRadius: '8px',
                                                marginBottom: '20px',
                                                padding: '20px',
                                                backgroundColor: '#fff'
                                            }}>
                                                <div className="order-header" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '15px',
                                                    paddingBottom: '15px',
                                                    borderBottom: '1px solid #eee'
                                                }}>
                                                    <div className="order-info">
                                                        <h5>Order #{order.id}</h5>
                                                        <p style={{ margin: '5px 0', color: '#6c757d' }}>
                                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="order-status">
                                                        <span 
                                                            className="status-badge"
                                                            style={{
                                                                backgroundColor: getStatusColor(order.status),
                                                                color: 'white',
                                                                padding: '5px 12px',
                                                                borderRadius: '15px',
                                                                fontSize: '12px',
                                                                textTransform: 'uppercase',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="order-details">
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div className="order-items">
                                                                <h6>Items ({order.items?.length || 0})</h6>
                                                                {order.items && order.items.slice(0, 3).map((item, index) => (
                                                                    <div key={index} className="order-item" style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        marginBottom: '10px',
                                                                        padding: '10px',
                                                                        backgroundColor: '#f8f9fa',
                                                                        borderRadius: '5px'
                                                                    }}>
                                                                        <div className="item-image" style={{
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            backgroundColor: '#dee2e6',
                                                                            borderRadius: '5px',
                                                                            marginRight: '15px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            <i className="fa fa-image" style={{ color: '#6c757d' }}></i>
                                                                        </div>
                                                                        <div className="item-details">
                                                                            <h6 style={{ margin: '0 0 5px 0' }}>
                                                                                {item.product_name || item.name}
                                                                            </h6>
                                                                            <p style={{ margin: '0', fontSize: '14px', color: '#6c757d' }}>
                                                                                Qty: {item.quantity} × ${item.price?.toFixed(2)}
                                                                                {item.size && ` • Size: ${item.size}`}
                                                                                {item.color && ` • Color: ${item.color}`}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {order.items && order.items.length > 3 && (
                                                                    <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '10px' }}>
                                                                        +{order.items.length - 3} more items
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="order-summary">
                                                                <h6>Order Total</h6>
                                                                <div className="total-amount" style={{
                                                                    fontSize: '24px',
                                                                    fontWeight: 'bold',
                                                                    color: '#ca1515',
                                                                    marginBottom: '15px'
                                                                }}>
                                                                    ${order.total?.toFixed(2) || '0.00'}
                                                                </div>
                                                                <div className="order-actions">
                                                                    <Link 
                                                                        to={`/order-confirmation/${order.id}`}
                                                                        className="site-btn"
                                                                        style={{ 
                                                                            width: '100%', 
                                                                            marginBottom: '10px',
                                                                            fontSize: '14px',
                                                                            padding: '8px 15px'
                                                                        }}
                                                                    >
                                                                        View Details
                                                                    </Link>
                                                                    {canCancelOrder(order.status) && (
                                                                        <button
                                                                            onClick={() => handleCancelOrder(order.id)}
                                                                            className="site-btn"
                                                                            style={{
                                                                                width: '100%',
                                                                                backgroundColor: '#dc3545',
                                                                                borderColor: '#dc3545',
                                                                                fontSize: '14px',
                                                                                padding: '8px 15px'
                                                                            }}
                                                                        >
                                                                            Cancel Order
                                                                        </button>
                                                                    )}
                                                                    {order.status?.toLowerCase() === 'shipped' && (
                                                                        <button
                                                                            className="site-btn"
                                                                            style={{
                                                                                width: '100%',
                                                                                backgroundColor: '#6f42c1',
                                                                                borderColor: '#6f42c1',
                                                                                fontSize: '14px',
                                                                                padding: '8px 15px',
                                                                                marginTop: '5px'
                                                                            }}
                                                                        >
                                                                            Track Order
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Orders Section End */}
        </>
    );
};

export default Orders;