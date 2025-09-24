
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {

         const response = await api.get('/api/products?isFeatured=true');
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []); 

  if (loading) {
    return <div className="loading-message">Loading products...</div>;
  }

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Featured Products</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No featured products available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;