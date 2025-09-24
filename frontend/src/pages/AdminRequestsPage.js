import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const AdminRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const fetchRequests = async () => {
            try {
                const response = await api.post('/api/admin/requests', {
                    userId: currentUser.uid 
                });
                setRequests(response.data);
            } catch (err) {
                setError('Failed to fetch product requests. You may not be authorized.');
                console.error(err);
            }
            setLoading(false);
        };
        fetchRequests();
    }, [currentUser]);

    if (loading) return <p>Loading requests...</p>;
    if (error) return <p className="admin-error">{error}</p>;

    return (
        <div>
            <div className="admin-page-header">
                <h2>Customer Product Requests</h2>
            </div>
            {requests.length === 0 ? (
                <p>No product requests have been submitted yet.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Requested Product Name</th>
                            <th>Date Requested</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={request._id}>
                                <td data-label="Product Name">{request.requestedProductName}</td>
                                <td data-label="Date">{new Date(request.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminRequestsPage;