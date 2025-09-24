
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css'; 
import './SearchPage.css';   

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const [requestedProduct, setRequestedProduct] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setRequestMessage(''); 

    const fetchSearchResults = async () => {
      try {
        const response = await api.get(`/api/products?search=${query}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };
    fetchSearchResults();
  }, [query]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestedProduct.trim()) return;
    try {
      await api.post('/api/product-requests', {
        productName: requestedProduct
      });
      setRequestMessage('Thank you! We have received your request.');
      setRequestedProduct(''); 
    } catch (error) {
      setRequestMessage('Sorry, something went wrong. Please try again.');
      console.error('Error submitting product request:', error);
    }
  };

  if (loading) {
    return <div className="loading-message">Searching for "{query}"...</div>;
  }

  
  const renderNoResults = () => (
    <div className="no-results-container">
      <p>No products found matching your search for "{query}".</p>
      <div className="request-form-container">
        <p>Can't find what you're looking for?</p>
        <form onSubmit={handleRequestSubmit}>
          <input
            type="text"
            className="request-input"
            placeholder="Tell us what you want"
            value={requestedProduct}
            onChange={(e) => setRequestedProduct(e.target.value)}
          />
          <button type="submit" className="request-button">Request Product</button>
        </form>
        {requestMessage && <p className="request-message">{requestMessage}</p>}
      </div>
    </div>
  );

  return (
    <div className="category-page-container">
      <h1 className="category-page-title">Search Results for "{query}"</h1>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        renderNoResults()
      )}
    </div>
  );
};

export default SearchPage;