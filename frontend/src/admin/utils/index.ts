// Admin utility functions

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Format date for input fields
export const formatDateForInput = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().slice(0, 16);
};

// Generate menu item ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate menu item data
export const validateMenuItem = (item: Partial<any>): string[] => {
  const errors: string[] = [];
  
  if (!item.name || item.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!item.description || item.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!item.price || item.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (!item.category || item.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  return errors;
};

// Get menu categories
export const getMenuCategories = (): string[] => {
  return [
    'Asian Street Food',
    'Starters',
    'Main Course',
    'Desserts',
    'Beverages',
    'Specials'
  ];
};

// Get dietary tags
export const getDietaryTags = (): string[] => {
  return [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Spicy',
    'Dairy-Free',
    'Nut-Free',
    'Low-Carb',
    'Protein-Rich'
  ];
};

// Filter menu items by category
export const filterByCategory = (items: any[], category: string): any[] => {
  if (category === 'All') return items;
  return items.filter(item => item.category === category);
};

// Search menu items
export const searchMenuItems = (items: any[], searchTerm: string): any[] => {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    (item.dietary_tags && item.dietary_tags.some((tag: string) => 
      tag.toLowerCase().includes(term)
    ))
  );
};

// Sort menu items
export const sortMenuItems = (items: any[], sortBy: string): any[] => {
  const sortedItems = [...items];
  
  switch (sortBy) {
    case 'name':
      return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    case 'price_low':
      return sortedItems.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sortedItems.sort((a, b) => b.price - a.price);
    case 'category':
      return sortedItems.sort((a, b) => a.category.localeCompare(b.category));
    case 'newest':
      return sortedItems.sort((a, b) => 
        new Date(b.created_at || Date.now()).getTime() - 
        new Date(a.created_at || Date.now()).getTime()
      );
    default:
      return sortedItems;
  }
};

// Calculate statistics
export const calculateStats = (items: any[], orders: any[] = []): any => {
  const totalItems = items.length;
  const availableItems = items.filter(item => item.is_available).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  return {
    totalItems,
    availableItems,
    totalOrders,
    totalRevenue,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
};

// Get user initials for avatar
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  } catch {
    return false;
  }
};

// Get default image based on category
export const getDefaultImage = (category: string): string => {
  const defaultImages = {
    'Asian Street Food': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
    'Starters': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400',
    'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    'Specials': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
  };
  
  return defaultImages[category as keyof typeof defaultImages] || 
         'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400';
};
