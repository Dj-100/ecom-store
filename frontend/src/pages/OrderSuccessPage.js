// src/pages/OrderSuccessPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  return (
    <div className="success-container">
      <div className="success-box">
        <h2>Thank You For Your Order!</h2>
        <p>Your order has been placed successfully.</p>
        <p>We will contact you shortly with confirmation details.</p>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;