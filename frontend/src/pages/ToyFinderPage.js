import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar'; 
import './CategoryPage.css';

const ToyFinderPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        sortBy: 'popularity',
        price_max: 5000,
        age: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    category: 'Toy',
                    sortBy: filters.sortBy,
                    price_max: filters.price_max
                });
                
                if (filters.age) {
                    params.append('age', filters.age);
                }
                const response = await api.get(`/api/products?${params.toString()}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching toy products:', error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [filters]); 

    return (
        <div className="page-container-with-sidebar">
            <div className="sidebar-wrapper">
               
                <FilterSidebar filters={filters} setFilters={setFilters} showAgeFilter={true} />
            </div>
            <div className="main-content-wrapper">
                <h1 className="category-page-title">Toy Finder</h1>
                {loading ? (
                   <div className="loading-message">Loading...</div>
                ) : (
                  <div className="product-grid">
                    {products.length > 0 ? (
                      products.map(product => <ProductCard key={product._id} product={product} />)
                    ) : (
                      <p>No toys found with the current filters. Try changing your search!</p>
                    )}
                  </div>
                )}
            </div>
        </div>
    );
};

export default ToyFinderPage;