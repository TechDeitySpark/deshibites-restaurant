export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages';
  image_url: string;
  is_available: boolean;
  dietary_tags: string[];
}

// Admin-specific MenuItem with additional properties for the management interface
export interface AdminMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages';
  status: 'available' | 'unavailable';
  tags: string[];
  image: string;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  orderTime: string;
  estimatedTime?: string;
  tableNumber?: string;
  deliveryAddress?: string;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  menuItems: number;
  customers: number;
}

export type AdminSection = 
  | 'dashboard' 
  | 'menu' 
  | 'orders' 
  | 'customers' 
  | 'analytics' 
  | 'inventory' 
  | 'promotions' 
  | 'settings'
  | 'Landing';

export interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export interface HeaderProps {
  activeSection: AdminSection;
  onMobileToggle: () => void;
  onAction?: (action: string) => void;
}

export interface MenuManagementProps {
  onAction?: (action: string, item?: AdminMenuItem) => void;
}

export interface OrderManagementProps {
  onAction?: (action: string, order?: AdminOrder) => void;
}

export interface AdminCustomer {
  id: number;
  customerType: 'registered' | 'guest';
  name: string;
  phone: string;
  email?: string;
  address?: string;
  registrationDate?: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints?: number;
  preferences?: {
    preferredOrderType: 'dine-in' | 'takeaway' | 'delivery';
    dietaryRestrictions: string[];
    favoriteItems: number[];
  };
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
}

export interface GuestOrder {
  id: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  orderData: AdminOrder;
  isRegistered: boolean;
}

export interface CustomerManagementProps {
  onAction?: (action: string, customer?: AdminCustomer) => void;
}

export interface RestaurantSettings {
  id: number;
  restaurantName: string;
  tagline: string;
  description: string;
  logo: string;
  bannerImage: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  businessHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  features: {
    onlineOrdering: boolean;
    tableReservations: boolean;
    deliveryService: boolean;
    loyaltyProgram: boolean;
    guestOrdering: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderAlerts: boolean;
    inventoryAlerts: boolean;
  };
  integrations: {
    paymentGateways: string[];
    deliveryPartners: string[];
    posSystem?: string;
    analyticsTracking?: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
}

export interface SettingsManagementProps {
  onAction?: (action: string, settings?: RestaurantSettings) => void;
}
