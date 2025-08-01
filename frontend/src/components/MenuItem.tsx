import React from 'react';
import { useCart } from '../context/CartContext';

interface MenuItem {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  badges: string[];
  spiceLevel: string;
}

interface MenuItemProps {
  item: MenuItem;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
    });
    
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="menu-item visible">
      <div className="item-image">
        <div className="badges">
          {item.badges.map((badge, index) => (
            <span key={index} className={`badge ${badge.toLowerCase()}`}>
              {badge}
            </span>
          ))}
        </div>
        <div className="spice-level">{item.spiceLevel}</div>
      </div>
      <div className="item-content">
        <div className="item-header">
          <h3 className="item-title">{item.title}</h3>
          <span className="item-price">{item.price}</span>
        </div>
        <p className="item-description">{item.description}</p>
        <div className="item-footer">
          <span className="item-category">Category: {item.category}</span>
          <button 
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {isAdded ? '✓ Added!' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemComponent;
