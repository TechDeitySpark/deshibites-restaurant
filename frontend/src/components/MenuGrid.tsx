import React, { useEffect, useState } from 'react';
import MenuItemComponent from './MenuItem';

interface MenuItem {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  badges: string[];
  spiceLevel: string;
}

interface MenuGridProps {
  activeCategory: string;
}

const MenuGrid: React.FC<MenuGridProps> = ({ activeCategory }) => {
  const [menuItems] = useState<MenuItem[]>([
    // Momos
    {
      id: 1,
      title: "Chicken Momo (Steamed/Fried)",
      price: "€4.00",
      description: "All-purpose flour, water, salt, oil, carrot, onion, garlic, ginger, soy sauce, pepper, minced chicken - 8 pieces",
      category: "Momos",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 2,
      title: "Veg Momo (Steamed/Fried)",
      price: "€4.00",
      description: "All-purpose flour, water, salt, oil, cabbage, carrot, onion, bell pepper, garlic, ginger, soy sauce, pepper - 8 pieces",
      category: "Momos",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 3,
      title: "Chicken Wonton with Dip",
      price: "€2.50",
      description: "All-purpose flour, water, salt, oil, minced chicken, onion, garlic, ginger, soy sauce, pepper, dip - 4 pieces",
      category: "Momos",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 4,
      title: "Mixed Vegetable Momo",
      price: "€4.50",
      description: "All-purpose flour, water, salt, oil, mixed vegetables, cabbage, carrot, onion, garlic, ginger, soy sauce, pepper - 8 pieces",
      category: "Momos",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 5,
      title: "Paneer Momo Special",
      price: "€5.00",
      description: "All-purpose flour, water, salt, oil, paneer, onion, garlic, ginger, special spices, soy sauce - 8 pieces",
      category: "Momos",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 6,
      title: "Cheese Corn Momo",
      price: "€4.80",
      description: "All-purpose flour, water, salt, oil, cheese, sweet corn, onion, garlic, ginger, herbs, pepper - 8 pieces",
      category: "Momos",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️🌶️"
    },
    // Fritters
    {
      id: 7,
      title: "Chicken Pakora",
      price: "€5.50",
      description: "Crispy chicken pieces coated in spiced gram flour batter, deep-fried to golden perfection - 6 pieces",
      category: "Fritters",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️🌶️"
    },
    {
      id: 8,
      title: "Vegetable Pakora Mix",
      price: "€4.20",
      description: "Assorted vegetables (onion, potato, cauliflower) in seasoned gram flour batter - 8 pieces",
      category: "Fritters",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 9,
      title: "Fish Finger Fry",
      price: "€6.00",
      description: "Fresh fish fillets marinated in spices, coated and fried until crispy - 5 pieces",
      category: "Fritters",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️"
    },
    // Rice Dishes
    {
      id: 10,
      title: "Chicken Fried Rice",
      price: "€7.50",
      description: "Basmati rice stir-fried with chicken, vegetables, soy sauce, and aromatic spices",
      category: "Rice Dishes",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 11,
      title: "Vegetable Biryani",
      price: "€6.80",
      description: "Fragrant basmati rice layered with mixed vegetables and traditional biryani spices",
      category: "Rice Dishes",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 12,
      title: "Egg Fried Rice",
      price: "€6.20",
      description: "Jasmine rice wok-fried with scrambled eggs, vegetables, and Asian seasonings",
      category: "Rice Dishes",
      badges: ["Halal"],
      spiceLevel: "🌶️"
    },
    // Noodles
    {
      id: 13,
      title: "Chicken Chow Mein",
      price: "€8.00",
      description: "Stir-fried noodles with chicken, vegetables, and savory soy-based sauce",
      category: "Noodles",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️"
    },
    {
      id: 14,
      title: "Vegetable Lo Mein",
      price: "€7.20",
      description: "Soft noodles tossed with fresh vegetables in garlic soy sauce",
      category: "Noodles",
      badges: ["Veg", "Halal"],
      spiceLevel: "🌶️"
    },
    {
      id: 15,
      title: "Spicy Beef Noodles",
      price: "€9.50",
      description: "Tender beef strips with noodles in spicy chili garlic sauce",
      category: "Noodles",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️🌶️🌶️"
    },
    // Specials
    {
      id: 16,
      title: "Deshi Special Platter",
      price: "€12.00",
      description: "A combination of chicken momo, pakora, fried rice, and special sauce - serves 1-2",
      category: "Specials",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️🌶️"
    },
    {
      id: 17,
      title: "Tandoori Chicken Wings",
      price: "€8.50",
      description: "Marinated chicken wings grilled in traditional tandoori spices - 6 pieces",
      category: "Specials",
      badges: ["Halal"],
      spiceLevel: "🌶️🌶️🌶️"
    },
    // Drinks
    {
      id: 18,
      title: "Mango Lassi",
      price: "€3.50",
      description: "Traditional yogurt-based drink blended with sweet mango pulp",
      category: "Drinks",
      badges: ["Veg"],
      spiceLevel: ""
    },
    {
      id: 19,
      title: "Masala Chai",
      price: "€2.80",
      description: "Authentic spiced tea brewed with cardamom, ginger, and aromatic herbs",
      category: "Drinks",
      badges: ["Veg"],
      spiceLevel: "🌶️"
    },
    {
      id: 20,
      title: "Fresh Lime Soda",
      price: "€2.50",
      description: "Refreshing lime juice with sparkling water and a hint of mint",
      category: "Drinks",
      badges: ["Veg"],
      spiceLevel: ""
    }
  ]);

  const filteredItems = activeCategory === 'All Items' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  useEffect(() => {
    // Animate items when they appear
    const items = document.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 100);
    });
  }, [filteredItems]);

  return (
    <main className="menu-grid">
      {filteredItems.map((item) => (
        <MenuItemComponent key={item.id} item={item} />
      ))}
    </main>
  );
};

export default MenuGrid;
