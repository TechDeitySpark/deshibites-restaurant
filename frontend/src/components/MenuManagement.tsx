import React, { useState, useEffect } from 'react';
import './MenuManagement.css';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'available' | 'unavailable';
  tags: string[];
  image: string;
  preparationTime?: string;
  ingredients?: string;
  allergens?: string[];
  nutritionInfo?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface MenuManagementProps {
  onAction?: (action: string) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ onAction }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
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

  // Sample menu items
  useEffect(() => {
    const sampleItems: MenuItem[] = [
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
        tags: ['halal', 'creamy'],
        image: '🍖'
      },
      {
        id: 3,
        name: 'Fish Curry',
        description: 'Traditional Bengali fish curry with mustard oil and spices',
        price: 320,
        category: 'mains',
        status: 'available',
        tags: ['traditional', 'spicy'],
        image: '🐟'
      },
      {
        id: 4,
        name: 'Vegetable Pakora',
        description: 'Crispy fried vegetable fritters with mint chutney',
        price: 120,
        category: 'appetizers',
        status: 'available',
        tags: ['vegetarian', 'crispy'],
        image: '🥬'
      },
      {
        id: 5,
        name: 'Mango Lassi',
        description: 'Sweet and creamy mango yogurt drink',
        price: 80,
        category: 'beverages',
        status: 'available',
        tags: ['sweet', 'dairy'],
        image: '🥭'
      }
    ];
    setMenuItems(sampleItems);
  }, []);

  const categories = ['all', 'appetizers', 'mains', 'desserts', 'beverages'];
  const statuses = ['all', 'available', 'unavailable'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
    setEditingItem(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image emoji is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const newItem: MenuItem = {
        id: editingItem ? editingItem.id : Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        status: formData.status,
        tags: formData.tags,
        image: formData.image.trim(),
        preparationTime: formData.preparationTime,
        ingredients: formData.ingredients.trim(),
        allergens: formData.allergens,
        nutritionInfo: formData.nutritionInfo
      };

      if (editingItem) {
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? newItem : item
        ));
      } else {
        setMenuItems(prev => [...prev, newItem]);
      }

      resetForm();
      setShowModal(false);
      
      if (onAction) {
        onAction(editingItem ? 'item-updated' : 'item-added');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      status: item.status,
      tags: item.tags,
      image: item.image,
      preparationTime: item.preparationTime || '15',
      ingredients: item.ingredients || '',
      allergens: item.allergens || [],
      nutritionInfo: item.nutritionInfo || {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      
      if (onAction) {
        onAction('item-deleted');
      }
    }
  };

  const handleStatusToggle = (id: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'available' ? 'unavailable' : 'available' }
        : item
    ));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="menu-management-container">
      <div className="menu-header">
        <h2>Menu Management</h2>
        <button 
          className="add-item-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          ➕ Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="menu-content">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="item-info">
                    <div className="item-icon">{item.image}</div>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-description">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`category-badge category-${item.category}`}>
                    {item.category}
                  </span>
                </td>
                <td className="price">৳{item.price}</td>
                <td>
                  <button
                    className={`status-badge status-${item.status}`}
                    onClick={() => handleStatusToggle(item.id)}
                  >
                    {item.status}
                  </button>
                </td>
                <td>
                  <div className="tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                      title="Edit Item"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                      title="Delete Item"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="no-items">
            <p>No menu items found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="menu-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Item Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="image">Image Emoji *</label>
                  <input
                    type="text"
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="🍛"
                    className={errors.image ? 'error' : ''}
                  />
                  {errors.image && <span className="error-message">{errors.image}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description"
                  rows={3}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (৳) *</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                    min="0"
                    step="1"
                    className={errors.price ? 'error' : ''}
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="appetizers">Appetizers</option>
                    <option value="mains">Main Courses</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'available' | 'unavailable' }))}
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
