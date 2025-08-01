// Example: Multilingual Menu Component for DeshiBites
import React, { useState, useEffect } from 'react';
import { useI18n, useDynamicTranslation } from '../hooks/useI18n';
import { HeaderLanguageSelector } from '../components/LanguageSelector';
import multilingualService from '../services/multilingualService';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  // Translated fields (from database joins)
  name_en?: string;
  name_de?: string;
  description_en?: string;
  description_de?: string;
  category_name_en?: string;
  category_name_de?: string;
  spice_level: 'none' | 'mild' | 'medium' | 'hot' | 'very_hot';
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  name_en?: string;
  name_de?: string;
  description_en?: string;
  description_de?: string;
}

export const MultilingualMenuExample: React.FC = () => {
  const { t, language } = useI18n();
  const { translateItem } = useDynamicTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Sample data (in real app, this would come from API)
  useEffect(() => {
    const loadMenuData = async () => {
      setLoading(true);
      
      // Simulate API call with multilingual data
      const sampleCategories: Category[] = [
        {
          id: 1,
          name: 'Appetizers',
          description: 'Start your meal with these delicious appetizers',
          name_en: 'Appetizers',
          name_de: 'Vorspeisen',
          description_en: 'Start your meal with these delicious appetizers',
          description_de: 'Beginnen Sie Ihr Essen mit diesen köstlichen Vorspeisen'
        },
        {
          id: 2,
          name: 'Main Course',
          description: 'Traditional Bengali main dishes',
          name_en: 'Main Course',
          name_de: 'Hauptgang',
          description_en: 'Traditional Bengali main dishes',
          description_de: 'Traditionelle bengalische Hauptgerichte'
        },
        {
          id: 3,
          name: 'Desserts',
          description: 'Sweet treats to end your meal',
          name_en: 'Desserts',
          name_de: 'Nachspeisen',
          description_en: 'Sweet treats to end your meal',
          description_de: 'Süße Leckereien zum Abschluss Ihres Essens'
        }
      ];

      const sampleMenuItems: MenuItem[] = [
        {
          id: 1,
          name: 'Fish Curry',
          description: 'Traditional Bengali fish curry with mustard oil and spices',
          name_en: 'Fish Curry',
          name_de: 'Fisch-Curry',
          description_en: 'Traditional Bengali fish curry with mustard oil and spices',
          description_de: 'Traditionelles bengalisches Fisch-Curry mit Senföl und Gewürzen',
          price: 350,
          category_id: 2,
          category_name_en: 'Main Course',
          category_name_de: 'Hauptgang',
          spice_level: 'medium',
          tags: ['popular', 'halal']
        },
        {
          id: 2,
          name: 'Prawn Malai Curry',
          description: 'Creamy prawn curry with coconut milk',
          name_en: 'Prawn Malai Curry',
          name_de: 'Garnelen-Malai-Curry',
          description_en: 'Creamy prawn curry with coconut milk',
          description_de: 'Cremiges Garnelen-Curry mit Kokosmilch',
          price: 450,
          category_id: 2,
          category_name_en: 'Main Course',
          category_name_de: 'Hauptgang',
          spice_level: 'mild',
          tags: ['chef_special']
        },
        {
          id: 3,
          name: 'Rasgulla',
          description: 'Classic Bengali sweet in sugar syrup',
          name_en: 'Rasgulla',
          name_de: 'Rasgulla',
          description_en: 'Classic Bengali sweet in sugar syrup',
          description_de: 'Klassische bengalische Süßspeise in Zuckersirup',
          price: 120,
          category_id: 3,
          category_name_en: 'Desserts',
          category_name_de: 'Nachspeisen',
          spice_level: 'none',
          tags: ['vegetarian', 'popular']
        }
      ];

      setCategories(sampleCategories);
      setMenuItems(sampleMenuItems);
      setLoading(false);
    };

    loadMenuData();
  }, [language]); // Reload when language changes

  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems;

  const getSpiceIcon = (level: string) => {
    const icons = {
      none: '',
      mild: '🌶️',
      medium: '🌶️🌶️',
      hot: '🌶️🌶️🌶️',
      very_hot: '🌶️🌶️🌶️🌶️'
    };
    return icons[level as keyof typeof icons] || '';
  };

  const getTagLabel = (tag: string) => {
    const tagMap: Record<string, string> = {
      vegetarian: t.menu.tags.vegetarian,
      vegan: t.menu.tags.vegan,
      halal: t.menu.tags.halal,
      spicy: t.menu.tags.spicy,
      popular: t.menu.tags.popular,
      new: t.menu.tags.new,
      chef_special: t.menu.tags.chef_special,
      gluten_free: t.menu.tags.gluten_free,
      dairy_free: t.menu.tags.dairy_free
    };
    return tagMap[tag] || tag;
  };

  const formatPrice = (price: number) => {
    // Format price based on language/region
    if (language === 'de') {
      return `€${(price / 75).toFixed(2)}`; // Convert INR to EUR (approximate)
    }
    return `₹${price}`;
  };

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner"></div>
        <p>{t.message.loading}</p>
      </div>
    );
  }

  return (
    <div className="multilingual-menu">
      {/* Header with language selector */}
      <header className="menu-header">
        <div className="header-content">
          <h1>{t.nav.menu}</h1>
          <HeaderLanguageSelector />
        </div>
      </header>

      {/* Category navigation */}
      <nav className="category-nav">
        <button
          className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          {t.action.view} {t.menu.items} {/* "View All" or "Alle anzeigen" */}
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {translateItem(category, 'name')}
          </button>
        ))}
      </nav>

      {/* Menu items grid */}
      <div className="menu-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>{t.message.no_data}</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="menu-item-card">
              {/* Item header */}
              <div className="item-header">
                <h3 className="item-name">
                  {translateItem(item, 'name')}
                </h3>
                <div className="item-price">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Item description */}
              <p className="item-description">
                {translateItem(item, 'description')}
              </p>

              {/* Item details */}
              <div className="item-details">
                {/* Category */}
                <span className="item-category">
                  {translateItem(item, 'category_name')}
                </span>

                {/* Spice level */}
                {item.spice_level !== 'none' && (
                  <div className="spice-level">
                    <span className="spice-icons">
                      {getSpiceIcon(item.spice_level)}
                    </span>
                    <span className="spice-text">
                      {t.menu.spice[item.spice_level as keyof typeof t.menu.spice]}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="item-tags">
                  {item.tags.map(tag => (
                    <span key={tag} className={`tag tag-${tag}`}>
                      {getTagLabel(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Action button */}
              <button className="add-to-cart-btn">
                {t.action.add} {/* "Add" or "Hinzufügen" */}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Language info footer */}
      <footer className="menu-footer">
        <div className="language-info">
          <p>
            {language === 'en' 
              ? 'Menu available in English and German'
              : 'Speisekarte auf Englisch und Deutsch verfügbar'
            }
          </p>
          <p className="translation-note">
            {language === 'en'
              ? 'Some specialty dish names are kept in original Bengali for authenticity'
              : 'Einige Spezialitätennamen werden zur Authentizität im ursprünglichen Bengali belassen'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

// CSS styles for the multilingual menu
export const menuStyles = `
.multilingual-menu {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.menu-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.category-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-btn {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.category-btn:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.category-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.menu-item-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.item-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  flex: 1;
}

.item-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #007bff;
  margin-left: 1rem;
}

.item-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.item-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.item-category {
  background: #f8f9fa;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #666;
}

.spice-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spice-icons {
  font-size: 0.9rem;
}

.spice-text {
  font-size: 0.85rem;
  color: #e74c3c;
  font-weight: 500;
}

.item-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-vegetarian { background: #d4edda; color: #155724; }
.tag-vegan { background: #d1ecf1; color: #0c5460; }
.tag-halal { background: #fff3cd; color: #856404; }
.tag-popular { background: #f8d7da; color: #721c24; }
.tag-chef_special { background: #e2e3e5; color: #383d41; }

.add-to-cart-btn {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #0056b3;
}

.menu-footer {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  color: #666;
}

.translation-note {
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 0.5rem;
}

.menu-loading {
  text-align: center;
  padding: 4rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-items {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #999;
}

/* German language adjustments */
[lang="de"] .menu-item-card {
  font-size: 0.95em; /* German text is often longer */
}

[lang="de"] .item-name {
  font-size: 1.2rem; /* Slightly smaller for longer German words */
}

/* Responsive design */
@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .category-nav {
    justify-content: center;
  }
  
  .item-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .item-price {
    margin-left: 0;
    align-self: flex-start;
  }
}
`;

export default MultilingualMenuExample;
