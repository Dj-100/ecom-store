
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './AdminPage.css';
import { Link, Outlet } from 'react-router-dom'; 

const AdminPage = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) {
                setError('You must be logged in to view this page.');
                setLoading(false);
                return;
            }
            try {
                const response = await api.post('/api/admin/orders', {
                    userId: currentUser.uid 
                });
                setOrders(response.data);
            } catch (err) {
                setError('Access Denied. You are not authorized to view this page.');
            }
            setLoading(false);
        };

        fetchOrders();
    }, [currentUser]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="admin-error">{error}</p>;

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <nav className="admin-nav">
    <Link to="/admin/orders">View Orders</Link>
    <Link to="/admin/products">Manage Products</Link>
    <Link to="/admin/requests">View Requests</Link>
</nav>
            <div className="admin-content">
                <Outlet /> 
            </div>
        </div>
    );
};

export default AdminPage;