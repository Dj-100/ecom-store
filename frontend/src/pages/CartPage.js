import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty.</p>
          <Link to="/" className="shop-now-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl || 'https://placehold.co/80x80/EEE/31343C?text=No+Image'} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>
                
                
                <div className="cart-item-actions">
                  <button className="quantity-btn" onClick={() => updateQuantity(item, item.qty - 1)}>-</button>
                  <span className="quantity-display">{item.qty}</span>
                  <button className="quantity-btn" onClick={() => updateQuantity(item, item.qty + 1)}>+</button>
                </div>
                <div className="cart-item-remove">
                  <button onClick={() => removeFromCart(item)} className="remove-btn">
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;