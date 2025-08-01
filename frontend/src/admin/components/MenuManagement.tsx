import React, { useState, useEffect } from 'react';
import { AdminMenuItem, MenuManagementProps } from '../types';

const MenuManagement: React.FC<MenuManagementProps> = ({ onAction }) => {
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'mains',
    status: 'available' as 'available' | 'unavailable',
    tags: [] as string[],
    image: '',
    preparationTime: '15',
    ingredients: '',
    allergens: [] as string[],
    nutritionInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }
  });

  // Enhanced sample menu items
  useEffect(() => {
    const sampleItems: AdminMenuItem[] = [
      {
        id: 1,
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken pieces and traditional spices',
        price: 280,
        category: 'mains',
        status: 'available',
        tags: ['halal', 'spicy'],
        image: '🍛'
      },
      {
        id: 2,
        name: 'Beef Rezala',
        description: 'Rich and creamy beef curry with aromatic spices',
        price: 350,
        category: 'mains',
        status: 'available',
        tags: ['halal', 'spicy'],
        image: '🍖'
      },
      {
        id: 3,
        name: 'Fish Curry',
        description: 'Traditional Bengali fish curry with hilsa fish',
        price: 320,
        category: 'mains',
        status: 'available',
        tags: ['spicy'],
        image: '🐟'
      },
      {
        id: 4,
        name: 'Vegetable Biryani',
        description: 'Fragrant rice with mixed vegetables and aromatic spices',
        price: 220,
        category: 'mains',
        status: 'available',
        tags: ['vegetarian', 'vegan'],
        image: '🥗'
      },
      {
        id: 5,
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes and peas',
        price: 25,
        category: 'appetizers',
        status: 'available',
        tags: ['vegetarian', 'vegan'],
        image: '🥟'
      },
      {
        id: 6,
        name: 'Rasgulla',
        description: 'Soft and spongy cottage cheese balls in sugar syrup',
        price: 60,
        category: 'desserts',
        status: 'available',
        tags: ['vegetarian'],
        image: '🍮'
      },
      {
        id: 7,
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink with fresh mango',
        price: 80,
        category: 'beverages',
        status: 'available',
        tags: ['vegetarian'],
        image: '🥭'
      },
      {
        id: 8,
        name: 'Prawn Malai Curry',
        description: 'Succulent prawns in coconut milk curry',
        price: 420,
        category: 'mains',
        status: 'unavailable',
        tags: ['spicy'],
        image: '🦐'
      }
    ];
    setMenuItems(sampleItems);
  }, []);

  // Enhanced filtering
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image emoji is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'mains',
      status: 'available',
      tags: [],
      image: '',
      preparationTime: '15',
      ingredients: '',
      allergens: [],
      nutritionInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setErrors({});
  };

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditItem = (item: AdminMenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      status: item.status,
      tags: [...item.tags],
      image: item.image,
      preparationTime: '15',
      ingredients: '',
      allergens: [],
      nutritionInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('⚠️ Are you sure you want to delete this item? This action cannot be undone.')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        setIsLoading(false);
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newItem: AdminMenuItem = {
        id: editingItem ? editingItem.id : Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category as 'appetizers' | 'mains' | 'desserts' | 'beverages',
        status: formData.status,
        tags: formData.tags,
        image: formData.image || '🍽️'
      };

      if (editingItem) {
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? newItem : item
        ));
      } else {
        setMenuItems(prev => [...prev, newItem]);
      }

      setShowModal(false);
      setIsLoading(false);
      resetForm();
    }, 1000);
  };

  const handleBulkAction = (action: string, selectedIds: number[]) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedIds.length} items?`)) {
          setMenuItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
        }
        break;
      case 'enable':
        setMenuItems(prev => prev.map(item => 
          selectedIds.includes(item.id) ? { ...item, status: 'available' as const } : item
        ));
        break;
      case 'disable':
        setMenuItems(prev => prev.map(item => 
          selectedIds.includes(item.id) ? { ...item, status: 'unavailable' as const } : item
        ));
        break;
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const getCategoryBadgeClass = (category: string) => {
    return `admin-category-badge category-${category}`;
  };

  const getStatusBadgeClass = (status: string) => {
    return `admin-status ${status}`;
  };

  // Predefined options
  const availableTags = ['vegetarian', 'vegan', 'halal', 'spicy', 'gluten-free', 'dairy-free', 'popular', 'chef-special'];
  const availableAllergens = ['gluten', 'dairy', 'nuts', 'shellfish', 'eggs', 'soy'];
  const emojiOptions = ['🍛', '🍖', '🐟', '🥗', '🥟', '🍮', '🥭', '🦐', '🍝', '🍕', '🍔', '🍟', '🌮', '🥘', '🍲', '🥙', '🥪', '🍰', '☕', '🥤'];

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>🍽️ Menu Management</h2>
        <div className="admin-stats">
          <div className="stat-item">
            <span className="stat-number">{menuItems.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{menuItems.filter(item => item.status === 'available').length}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{menuItems.filter(item => item.status === 'unavailable').length}</span>
            <span className="stat-label">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="admin-filters">
        <div className="admin-search-bar">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Categories</option>
          <option value="appetizers">Appetizers</option>
          <option value="mains">Main Courses</option>
          <option value="desserts">Desserts</option>
          <option value="beverages">Beverages</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        
        <button 
          className="admin-btn admin-btn-primary"
          onClick={handleAddItem}
        >
          <span>➕</span>
          Add New Item
        </button>
      </div>

      {/* Enhanced Table */}
      <div className="admin-table-wrapper">
        {filteredItems.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No menu items found</h3>
            <p>Try adjusting your search criteria or add a new item.</p>
            <button className="admin-btn admin-btn-primary" onClick={handleAddItem}>
              Add First Item
            </button>
          </div>
        ) : (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-item-display">
                      <div className="admin-item-image">
                        {item.image}
                      </div>
                      <div className="admin-item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={getCategoryBadgeClass(item.category)}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <span className="admin-price">৳{item.price}</span>
                  </td>
                  <td>
                    <div className="admin-tags-container">
                      {item.tags.length > 0 ? (
                        item.tags.map((tag, index) => (
                          <span key={index} className={`admin-tag ${tag}`}>
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="admin-no-tags">No tags</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status === 'available' ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn admin-edit-btn"
                        onClick={() => handleEditItem(item)}
                        title="Edit Item"
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-action-btn admin-delete-btn"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete Item"
                        disabled={isLoading}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content large-modal">
            <div className="admin-modal-header">
              <h2>
                {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
              </h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="form-section">
                  <h3>📝 Basic Information</h3>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Item Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Chicken Biryani"
                        className={errors.name ? 'error' : ''}
                        required
                      />
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="appetizers">🥗 Appetizers</option>
                        <option value="mains">🍛 Main Courses</option>
                        <option value="desserts">🍰 Desserts</option>
                        <option value="beverages">🥤 Beverages</option>
                      </select>
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Price (৳) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="280"
                        className={errors.price ? 'error' : ''}
                        required
                      />
                      {errors.price && <span className="error-text">{errors.price}</span>}
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'available' | 'unavailable' }))}
                      >
                        <option value="available">✅ Available</option>
                        <option value="unavailable">❌ Unavailable</option>
                      </select>
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Preparation Time (minutes)</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                        placeholder="15"
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Image Emoji *</label>
                      <div className="emoji-selector">
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="🍽️"
                          className={errors.image ? 'error' : ''}
                          maxLength={2}
                        />
                        <div className="emoji-options">
                          {emojiOptions.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              className={`emoji-option ${formData.image === emoji ? 'selected' : ''}`}
                              onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                      {errors.image && <span className="error-text">{errors.image}</span>}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-section">
                  <h3>📄 Description</h3>
                  <div className="admin-form-group full-width">
                    <label>Item Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      placeholder="Describe the dish, ingredients, and what makes it special..."
                      className={errors.description ? 'error' : ''}
                      required
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                  </div>
                </div>

                {/* Tags and Allergens */}
                <div className="form-section">
                  <h3>🏷️ Tags & Dietary Information</h3>
                  <div className="admin-form-group full-width">
                    <label>Dietary Tags</label>
                    <div className="tags-grid">
                      {availableTags.map(tag => (
                        <div key={tag} className="admin-checkbox-group">
                          <input
                            type="checkbox"
                            id={`tag-${tag}`}
                            checked={formData.tags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                          />
                          <label htmlFor={`tag-${tag}`} className="tag-label">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="admin-form-group full-width">
                    <label>Allergens (Contains)</label>
                    <div className="tags-grid">
                      {availableAllergens.map(allergen => (
                        <div key={allergen} className="admin-checkbox-group">
                          <input
                            type="checkbox"
                            id={`allergen-${allergen}`}
                            checked={formData.allergens.includes(allergen)}
                            onChange={() => handleAllergenToggle(allergen)}
                          />
                          <label htmlFor={`allergen-${allergen}`} className="allergen-label">
                            {allergen}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="admin-btn admin-btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>⏳ {editingItem ? 'Updating...' : 'Adding...'}</>
                    ) : (
                      <>{editingItem ? '💾 Update Item' : '➕ Add Item'}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳ Processing...</div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
