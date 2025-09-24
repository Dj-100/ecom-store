import React from 'react';
import './ProductCard.css';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart } = useCart();

  
  const itemInCart = cartItems.find(item => item._id === product._id);
  const quantityInCart = itemInCart ? itemInCart.qty : 0;

  return (
    <div className="product-card">
      <img src={product.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="price-container">
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <span className="original-price">₹{product.originalPrice}</span>
              <span className="sale-price">₹{product.price}</span>
            </>
          ) : (
            <span className="sale-price">₹{product.price}</span>
          )}
        </div>

       
        <div className="add-to-cart-container">
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
         
          {quantityInCart > 0 && (
            <div className="quantity-badge">{quantityInCart} in cart</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;