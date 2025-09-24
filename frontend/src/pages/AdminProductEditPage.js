import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const AdminProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const isEditMode = Boolean(id);

    const ALL_CATEGORIES = ['Study', 'Toy', 'Gift', 'Household'];

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        category: [],
        imageUrl: '',
        isFeatured: false,
        popularity: 3, 
        ageFrom: '',
        ageTo: ''
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                   const { data } = await api.get(`/api/products/${id}`);
                   if (!Array.isArray(data.category)) {
                       data.category = [data.category];
                   }
                   setProductData(data);
                } catch (err) {
                   setError('Could not find product.');
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setProductData(prev => {
            if (checked) {
                return { ...prev, category: [...prev.category, value] };
            } else {
                return { ...prev, category: prev.category.filter(cat => cat !== value) };
            }
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        setUploading(true);
        try {
            const { data } = await api.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            setProductData(prev => ({ ...prev, imageUrl: data.secure_url }));
        } catch (error) {
            console.error('Image upload failed', error);
            setError('Image upload failed. Please check your Cloudinary settings.');
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (productData.category.length === 0) {
            setError("Please select at least one category.");
            return;
        }
        try {
            const submissionData = {
                userId: currentUser.uid,
                productData: productData
            };

            if (isEditMode) {
                await api.put(`/api/products/${id}`, submissionData);
            } else {
                await api.post('/api/products', submissionData);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Failed to save product', error);
            setError('Failed to save product. You may not be authorized.');
        }
    };

    return (
    <div>
        <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <p className="admin-error">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-form">
            <label>Product Name</label>
            <input name="name" value={productData.name} onChange={handleChange} placeholder="Product Name" required />
            
            <label>Description</label>
            <textarea name="description" value={productData.description} onChange={handleChange} placeholder="Description" rows="5" required />
            
            <div className="form-group-inline">
                <div>
                    <label>Sale Price (₹)</label>
                    <input name="price" type="number" value={productData.price} onChange={handleChange} placeholder="e.g., 360" required />
                </div>
                <div>
                    <label>Original Price (Optional)</label>
                    <input name="originalPrice" type="number" value={productData.originalPrice} onChange={handleChange} placeholder="e.g., 740" />
                </div>
            </div>
            
            <label>Stock Quantity</label>
            <input name="stock" type="number" value={productData.stock} onChange={handleChange} placeholder="Stock" required />
            
            <label>Categories (Select all that apply)</label>
            <div className="category-checkbox-group">
                {ALL_CATEGORIES.map(cat => (
                    <label key={cat}>
                        <input
                            type="checkbox"
                            name="category"
                            value={cat}
                            checked={productData.category.includes(cat)}
                            onChange={handleCategoryChange}
                        />
                        {cat}
                    </label>
                ))}
            </div>

            
            {(productData.category.includes('Gift') || productData.category.includes('Toy')) && (
                <>
                   <label>Age Range (for Gifts & Toys)</label>
                   <div className="form-group-inline">
                     <input name="ageFrom" type="number" value={productData.ageFrom} onChange={handleChange} placeholder="From" />
                     <input name="ageTo" type="number" value={productData.ageTo} onChange={handleChange} placeholder="To" />
                   </div>
                </>
            )}
            
            
            
            <label>Popularity (for sorting)</label>
            <select name="popularity" value={productData.popularity} onChange={handleChange}>
                <option value="1">High (Appears First)</option>
                <option value="2">Medium</option>
                <option value="3">Low (Appears Last)</option>
            </select>

            <label>Image</label>
            <input type="file" onChange={handleImageUpload} />
            {uploading && <p>Uploading image...</p>}
            {productData.imageUrl ? <img src={productData.imageUrl} alt="preview" className="admin-product-image" /> : <p>No image uploaded.</p>}
            
            <div className="form-group-inline">
              <label><input type="checkbox" name="isFeatured" checked={productData.isFeatured} onChange={handleChange} /> Feature on Homepage</label>
            </div>

            <button type="submit" className="admin-btn primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save Product'}
            </button>
        </form>
    </div>
);
};
export default AdminProductEditPage;