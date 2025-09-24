
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './AdminPage.css';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const { currentUser } = useAuth(); 

    
    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/api/products');
            setProducts(data);
        } catch (error) {
            console.error("Could not fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    
    const handleDelete = async (id) => {
        
        if (window.confirm('Are you sure you want to delete this product forever?')) {
            try {
                
                await api.post(`/api/products/delete/${id}`, {
                    userId: currentUser.uid
                });
                
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Error: Could not delete product. You may not be authorized.");
            }
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h2>Manage Products</h2>
                <Link to="/admin/products/new" className="admin-btn primary">Add New Product</Link>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td data-label="Image"><img src={product.imageUrl || 'https://placehold.co/60x60/EEE/31343C?text=No+Image'} alt={product.name} className="admin-product-image" /></td>
                            <td>{product.name}</td>
                            <td>₹{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.category}</td>
                            <td>
                                <Link to={`/admin/products/edit/${product._id}`} className="admin-btn">Edit</Link>
                                <button onClick={() => handleDelete(product._id)} className="admin-btn danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductsPage;