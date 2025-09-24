import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const getInitialCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item._id === product._id);
      if (exist) {
        
        if (exist.qty < 3) {
          return prevItems.map(item =>
            item._id === product._id ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          
          alert("You can only add a maximum of 3 of the same item.");
          return prevItems; 
        }
      } else {
       
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (product) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== product._id));
  };

 
  const updateQuantity = (product, newQty) => {
    const quantity = Number(newQty);
    
   
    if (quantity < 1) {
      removeFromCart(product);
    } 
    
    else if (quantity > 3) {
      alert("You can only have a maximum of 3 of the same item.");
      return; 
    } 
   
    else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === product._id ? { ...item, qty: quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};