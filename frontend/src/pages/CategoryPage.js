import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar'; // It uses the smart sidebar
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    sortBy: 'popularity',
    price_max: 5000,
  });

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category: categoryName,
          sortBy: filters.sortBy,
          price_max: filters.price_max,
        });
        const response = await api.get(`/api/products?${params.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error(`Error fetching ${categoryName} products:`, error);
      }
      setLoading(false);
    };

    fetchProductsByCategory();
  }, [categoryName, filters]); 

  return (
    <div className="page-container-with-sidebar">
      <div className="sidebar-wrapper">
        
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </div>
      <div className="main-content-wrapper">
        <h1 className="category-page-title">{categoryName} Section</h1>
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;