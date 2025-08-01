import React from 'react';
import { useCart } from '../context/CartContext';

const FloatingCart: React.FC = () => {
  const { state, toggleCart, getTotalItems, getTotalPrice } = useCart();
  const itemCount = getTotalItems();
  const totalPrice = getTotalPrice();

  // Don't show if cart is empty or cart sidebar is open
  if (itemCount === 0 || state.isOpen) return null;

  return (
    <div 
      className="floating-cart" 
      onClick={toggleCart}
    >
      <div className="floating-cart-content">
        <div className="floating-cart-icon">
          <span className="cart-emoji">🛒</span>
          <div className="floating-cart-badge">{itemCount}</div>
        </div>
        <div className="floating-cart-info">
          <div className="floating-cart-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
          <div className="floating-cart-total">€{totalPrice.toFixed(2)}</div>
        </div>
      </div>
      <div className="floating-cart-text">View Cart</div>
    </div>
  );
};

export default FloatingCart;
