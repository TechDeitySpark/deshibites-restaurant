import React from 'react';

interface MenuNavProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const MenuNav: React.FC<MenuNavProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { name: 'All Items', icon: '🍽️' },
    { name: 'Momos', icon: '🥟' },
    { name: 'Fritters', icon: '🍤' },
    { name: 'Rice Dishes', icon: '🍚' },
    { name: 'Noodles', icon: '🍜' },
    { name: 'Specials', icon: '⭐' },
    { name: 'Drinks', icon: '🥤' }
  ];

  return (
    <nav className="menu-nav">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`menu-btn ${activeCategory === category.name ? 'active' : ''}`}
          onClick={() => setActiveCategory(category.name)}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </nav>
  );
};

export default MenuNav;
