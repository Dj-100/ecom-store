// src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      
      setCustomerInfo(prevInfo => ({ ...prevInfo, name: currentUser.displayName || '' }));
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const totalAmount = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const orderData = {
      userId: currentUser.uid,
      customerEmail: currentUser.email, 
      customerInfo,
      orderItems: cartItems,
      totalAmount,
    };

    try {
      await api.post('/api/orders', orderData);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Shipping Details</h2>
        {error && <p className="checkout-error">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={customerInfo.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={customerInfo.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Full Shipping Address"
          value={customerInfo.address}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
        <button type="submit" disabled={loading || cartItems.length === 0}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;