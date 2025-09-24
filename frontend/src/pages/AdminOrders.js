
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './AdminPage.css';

const AdminOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) {
            setError("Please log in to view orders.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await api.post('/api/admin/orders', {
                    userId: currentUser.uid
                });
                setOrders(response.data);
            } catch (err) {
                setError('Access Denied. You are not authorized to view this page.');
                console.error("Failed to fetch orders:", err);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [currentUser]);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="admin-error">{error}</p>;

    return (
        <div className="orders-list">
            <h2>All Customer Orders</h2>
            {orders.length === 0 ? (
                <p>No orders have been placed yet.</p>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="order-card">
                        <h3>Order from: {order.customerName}</h3>
                        <p><strong>Email:</strong> {order.customerEmail}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                        <p><strong>Address:</strong> {order.customerAddress}</p>
                        <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                        <h4>Items:</h4>
                        <ul>
                            {order.orderItems.map(item => (
                                <li key={item._id}>{item.qty} x {item.name}</li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminOrders;