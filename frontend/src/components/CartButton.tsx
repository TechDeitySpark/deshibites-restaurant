import React from 'react';
import { useCart } from '../context/CartContext';

const CartButton: React.FC = () => {
  const { toggleCart, getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button className="cart-button" onClick={toggleCart}>
      <span className="cart-icon">🛒</span>
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
      <span className="cart-text">Cart</span>
    </button>
  );
};

export default CartButton;
