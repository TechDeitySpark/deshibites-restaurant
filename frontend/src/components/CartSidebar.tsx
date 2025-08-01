import React from 'react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onCheckout }) => {
  const { state, removeItem, updateQuantity, closeCart, getTotalPrice } = useCart();

  if (!state.isOpen) return null;

  const handleCheckout = () => {
    if (state.items.length > 0) {
      closeCart();
      onCheckout();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="cart-overlay" 
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="cart-close-btn" onClick={closeCart}>×</button>
        </div>
        
        <div className="cart-content">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <span>Add some delicious items!</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {state.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p className="cart-item-price">{item.price}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: €{getTotalPrice().toFixed(2)}</strong>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
