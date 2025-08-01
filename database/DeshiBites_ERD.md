# DeshiBites Restaurant Management System - Complete ERD

## 📊 Entity Relationship Diagram

This ERD represents the complete database schema for the DeshiBites restaurant management system, including all modules: Menu Management, Order Management, Customer Management, POS Integration, Settings, Analytics, and more.

## 🗄️ Database Tables & Relationships

### 1. **RESTAURANTS** (Main Entity)
```sql
restaurants {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255) NOT NULL
  tagline: VARCHAR(500)
  description: TEXT
  logo_url: VARCHAR(500)
  banner_url: VARCHAR(500)
  favicon_url: VARCHAR(500)
  primary_color: VARCHAR(7)
  secondary_color: VARCHAR(7)
  accent_color: VARCHAR(7)
  phone: VARCHAR(20)
  email: VARCHAR(255)
  address: TEXT
  website: VARCHAR(500)
  facebook_url: VARCHAR(500)
  instagram_url: VARCHAR(500)
  twitter_url: VARCHAR(500)
  youtube_url: VARCHAR(500)
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
}
```

### 2. **BUSINESS_HOURS**
```sql
business_hours {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  day_of_week: ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
  open_time: TIME
  close_time: TIME
  is_closed: BOOLEAN DEFAULT FALSE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE(restaurant_id, day_of_week)
}
```

### 3. **CATEGORIES**
```sql
categories {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  name: VARCHAR(255) NOT NULL
  description: TEXT
  image_url: VARCHAR(500)
  sort_order: INTEGER DEFAULT 0
  is_active: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
}
```

### 4. **MENU_ITEMS**
```sql
menu_items {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  category_id: INTEGER NOT NULL
  name: VARCHAR(255) NOT NULL
  description: TEXT
  price: DECIMAL(10,2) NOT NULL
  original_price: DECIMAL(10,2)
  image_url: VARCHAR(500)
  is_available: BOOLEAN DEFAULT TRUE
  is_featured: BOOLEAN DEFAULT FALSE
  preparation_time: INTEGER -- in minutes
  calories: INTEGER
  spice_level: ENUM('none', 'mild', 'medium', 'hot', 'very_hot')
  pos_item_id: VARCHAR(100) -- POS system integration
  sort_order: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
  INDEX(pos_item_id)
}
```

### 5. **MENU_ITEM_TAGS**
```sql
menu_item_tags {
  id: INTEGER PRIMARY KEY
  menu_item_id: INTEGER NOT NULL
  tag: ENUM('vegetarian', 'vegan', 'halal', 'spicy', 'popular', 'new', 'chef_special', 'gluten_free', 'dairy_free')
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
  UNIQUE(menu_item_id, tag)
}
```

### 6. **MENU_ITEM_VARIATIONS**
```sql
menu_item_variations {
  id: INTEGER PRIMARY KEY
  menu_item_id: INTEGER NOT NULL
  name: VARCHAR(255) NOT NULL -- e.g., "Small", "Medium", "Large"
  price_adjustment: DECIMAL(10,2) DEFAULT 0.00
  is_default: BOOLEAN DEFAULT FALSE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
}
```

### 7. **ADDONS**
```sql
addons {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  name: VARCHAR(255) NOT NULL
  price: DECIMAL(10,2) NOT NULL
  category: VARCHAR(100) -- e.g., "Extra Toppings", "Sides", "Drinks"
  is_available: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
}
```

### 8. **MENU_ITEM_ADDONS** (Many-to-Many)
```sql
menu_item_addons {
  id: INTEGER PRIMARY KEY
  menu_item_id: INTEGER NOT NULL
  addon_id: INTEGER NOT NULL
  is_required: BOOLEAN DEFAULT FALSE
  max_quantity: INTEGER DEFAULT 1
  
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
  FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
  UNIQUE(menu_item_id, addon_id)
}
```

### 9. **CUSTOMERS**
```sql
customers {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  first_name: VARCHAR(255)
  last_name: VARCHAR(255)
  email: VARCHAR(255)
  phone: VARCHAR(20) NOT NULL
  date_of_birth: DATE
  gender: ENUM('male', 'female', 'other')
  loyalty_points: INTEGER DEFAULT 0
  total_orders: INTEGER DEFAULT 0
  total_spent: DECIMAL(12,2) DEFAULT 0.00
  favorite_items: JSON -- Store array of menu item IDs
  dietary_preferences: JSON -- Store dietary restrictions/preferences
  is_active: BOOLEAN DEFAULT TRUE
  last_order_date: TIMESTAMP
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE(restaurant_id, phone)
  INDEX(email)
}
```

### 10. **CUSTOMER_ADDRESSES**
```sql
customer_addresses {
  id: INTEGER PRIMARY KEY
  customer_id: INTEGER NOT NULL
  label: VARCHAR(100) -- e.g., "Home", "Office"
  street_address: TEXT NOT NULL
  city: VARCHAR(100) NOT NULL
  state: VARCHAR(100)
  postal_code: VARCHAR(20)
  country: VARCHAR(100) DEFAULT 'India'
  latitude: DECIMAL(10, 8)
  longitude: DECIMAL(11, 8)
  is_default: BOOLEAN DEFAULT FALSE
  delivery_instructions: TEXT
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
}
```

### 11. **ORDERS**
```sql
orders {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  customer_id: INTEGER
  order_number: VARCHAR(50) NOT NULL
  order_type: ENUM('dine_in', 'takeaway', 'delivery', 'online') NOT NULL
  order_status: ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled') DEFAULT 'pending'
  payment_status: ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded') DEFAULT 'pending'
  
  -- Order Details
  subtotal: DECIMAL(10,2) NOT NULL
  tax_amount: DECIMAL(10,2) DEFAULT 0.00
  delivery_fee: DECIMAL(10,2) DEFAULT 0.00
  discount_amount: DECIMAL(10,2) DEFAULT 0.00
  tip_amount: DECIMAL(10,2) DEFAULT 0.00
  total_amount: DECIMAL(10,2) NOT NULL
  
  -- Customer Info (for guest orders)
  guest_name: VARCHAR(255)
  guest_phone: VARCHAR(20)
  guest_email: VARCHAR(255)
  
  -- Delivery/Pickup Info
  delivery_address_id: INTEGER
  delivery_instructions: TEXT
  estimated_delivery_time: TIMESTAMP
  actual_delivery_time: TIMESTAMP
  table_number: VARCHAR(10)
  
  -- Special Instructions
  special_instructions: TEXT
  
  -- POS Integration
  pos_order_id: VARCHAR(100)
  pos_payment_id: VARCHAR(100)
  
  -- Timestamps
  order_date: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  confirmed_at: TIMESTAMP
  prepared_at: TIMESTAMP
  delivered_at: TIMESTAMP
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
  FOREIGN KEY (delivery_address_id) REFERENCES customer_addresses(id) ON DELETE SET NULL
  UNIQUE(restaurant_id, order_number)
  INDEX(pos_order_id)
  INDEX(order_date)
}
```

### 12. **ORDER_ITEMS**
```sql
order_items {
  id: INTEGER PRIMARY KEY
  order_id: INTEGER NOT NULL
  menu_item_id: INTEGER NOT NULL
  variation_id: INTEGER
  quantity: INTEGER NOT NULL
  unit_price: DECIMAL(10,2) NOT NULL
  total_price: DECIMAL(10,2) NOT NULL
  special_instructions: TEXT
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
  FOREIGN KEY (variation_id) REFERENCES menu_item_variations(id) ON DELETE SET NULL
}
```

### 13. **ORDER_ITEM_ADDONS**
```sql
order_item_addons {
  id: INTEGER PRIMARY KEY
  order_item_id: INTEGER NOT NULL
  addon_id: INTEGER NOT NULL
  quantity: INTEGER DEFAULT 1
  unit_price: DECIMAL(10,2) NOT NULL
  total_price: DECIMAL(10,2) NOT NULL
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
  FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE RESTRICT
}
```

### 14. **PAYMENTS**
```sql
payments {
  id: INTEGER PRIMARY KEY
  order_id: INTEGER NOT NULL
  payment_method: ENUM('cash', 'card', 'upi', 'wallet', 'online', 'pos') NOT NULL
  payment_gateway: VARCHAR(100) -- e.g., "Razorpay", "Square", "Stripe"
  transaction_id: VARCHAR(255)
  gateway_transaction_id: VARCHAR(255)
  amount: DECIMAL(10,2) NOT NULL
  currency: VARCHAR(3) DEFAULT 'INR'
  payment_status: ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending'
  gateway_response: JSON
  processed_at: TIMESTAMP
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  INDEX(transaction_id)
  INDEX(gateway_transaction_id)
}
```

### 15. **DISCOUNTS_COUPONS**
```sql
discounts_coupons {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  code: VARCHAR(50) NOT NULL
  name: VARCHAR(255) NOT NULL
  description: TEXT
  discount_type: ENUM('percentage', 'fixed_amount', 'free_delivery') NOT NULL
  discount_value: DECIMAL(10,2) NOT NULL
  minimum_order_amount: DECIMAL(10,2) DEFAULT 0.00
  maximum_discount: DECIMAL(10,2)
  usage_limit: INTEGER
  usage_per_customer: INTEGER DEFAULT 1
  current_usage: INTEGER DEFAULT 0
  applicable_items: JSON -- Array of menu item IDs
  customer_tiers: JSON -- Array of customer tiers
  start_date: TIMESTAMP
  end_date: TIMESTAMP
  is_active: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE(restaurant_id, code)
}
```

### 16. **COUPON_USAGE**
```sql
coupon_usage {
  id: INTEGER PRIMARY KEY
  coupon_id: INTEGER NOT NULL
  order_id: INTEGER NOT NULL
  customer_id: INTEGER
  discount_amount: DECIMAL(10,2) NOT NULL
  used_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (coupon_id) REFERENCES discounts_coupons(id) ON DELETE CASCADE
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
}
```

### 17. **INVENTORY**
```sql
inventory {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  item_name: VARCHAR(255) NOT NULL
  category: VARCHAR(100)
  unit: VARCHAR(50) -- e.g., "kg", "pieces", "liters"
  current_stock: DECIMAL(10,3) NOT NULL
  minimum_stock: DECIMAL(10,3) DEFAULT 0
  maximum_stock: DECIMAL(10,3)
  cost_per_unit: DECIMAL(10,2)
  supplier: VARCHAR(255)
  last_restocked: TIMESTAMP
  expiry_date: DATE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
}
```

### 18. **MENU_ITEM_INGREDIENTS** (Recipe Management)
```sql
menu_item_ingredients {
  id: INTEGER PRIMARY KEY
  menu_item_id: INTEGER NOT NULL
  inventory_item_id: INTEGER NOT NULL
  quantity_required: DECIMAL(10,3) NOT NULL
  unit: VARCHAR(50)
  
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
  FOREIGN KEY (inventory_item_id) REFERENCES inventory(id) ON DELETE RESTRICT
  UNIQUE(menu_item_id, inventory_item_id)
}
```

### 19. **STAFF**
```sql
staff {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  employee_id: VARCHAR(50) NOT NULL
  first_name: VARCHAR(255) NOT NULL
  last_name: VARCHAR(255) NOT NULL
  email: VARCHAR(255) NOT NULL
  phone: VARCHAR(20) NOT NULL
  role: ENUM('admin', 'manager', 'chef', 'waiter', 'cashier', 'delivery') NOT NULL
  permissions: JSON -- Array of permissions
  hire_date: DATE NOT NULL
  salary: DECIMAL(10,2)
  is_active: BOOLEAN DEFAULT TRUE
  last_login: TIMESTAMP
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE(restaurant_id, employee_id)
  UNIQUE(email)
}
```

### 20. **STAFF_SHIFTS**
```sql
staff_shifts {
  id: INTEGER PRIMARY KEY
  staff_id: INTEGER NOT NULL
  shift_date: DATE NOT NULL
  start_time: TIME NOT NULL
  end_time: TIME NOT NULL
  break_duration: INTEGER DEFAULT 0 -- in minutes
  actual_start_time: TIME
  actual_end_time: TIME
  hours_worked: DECIMAL(4,2)
  overtime_hours: DECIMAL(4,2) DEFAULT 0
  status: ENUM('scheduled', 'started', 'on_break', 'completed', 'absent') DEFAULT 'scheduled'
  notes: TEXT
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
}
```

### 21. **TABLES**
```sql
tables {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  table_number: VARCHAR(10) NOT NULL
  capacity: INTEGER NOT NULL
  location: VARCHAR(100) -- e.g., "Ground Floor", "Terrace"
  status: ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available'
  qr_code: VARCHAR(255) -- For QR code ordering
  is_active: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE(restaurant_id, table_number)
}
```

### 22. **RESERVATIONS**
```sql
reservations {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  customer_id: INTEGER
  table_id: INTEGER
  guest_name: VARCHAR(255)
  guest_phone: VARCHAR(20) NOT NULL
  guest_email: VARCHAR(255)
  party_size: INTEGER NOT NULL
  reservation_date: DATE NOT NULL
  reservation_time: TIME NOT NULL
  duration: INTEGER DEFAULT 120 -- in minutes
  status: ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show') DEFAULT 'pending'
  special_requests: TEXT
  confirmed_at: TIMESTAMP
  seated_at: TIMESTAMP
  completed_at: TIMESTAMP
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
}
```

### 23. **POS_INTEGRATIONS**
```sql
pos_integrations {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  provider: ENUM('square', 'toast', 'clover', 'lightspeed', 'touchbistro') NOT NULL
  merchant_id: VARCHAR(255)
  location_id: VARCHAR(255)
  api_key_encrypted: TEXT -- Encrypted API key
  environment: ENUM('sandbox', 'production') DEFAULT 'sandbox'
  webhook_url: VARCHAR(500)
  is_active: BOOLEAN DEFAULT FALSE
  last_sync: TIMESTAMP
  sync_status: ENUM('success', 'error', 'pending') DEFAULT 'pending'
  error_message: TEXT
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
}
```

### 24. **SYNC_LOGS**
```sql
sync_logs {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  pos_integration_id: INTEGER NOT NULL
  sync_type: ENUM('menu', 'orders', 'payments', 'inventory') NOT NULL
  sync_direction: ENUM('import', 'export', 'bidirectional') NOT NULL
  status: ENUM('started', 'completed', 'failed') NOT NULL
  records_processed: INTEGER DEFAULT 0
  records_successful: INTEGER DEFAULT 0
  records_failed: INTEGER DEFAULT 0
  error_details: JSON
  started_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  completed_at: TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  FOREIGN KEY (pos_integration_id) REFERENCES pos_integrations(id) ON DELETE CASCADE
}
```

### 25. **ANALYTICS_EVENTS**
```sql
analytics_events {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  event_type: VARCHAR(100) NOT NULL -- e.g., "order_placed", "menu_viewed", "customer_registered"
  event_data: JSON
  user_id: INTEGER -- Could be customer_id or staff_id
  user_type: ENUM('customer', 'staff', 'guest')
  session_id: VARCHAR(255)
  ip_address: VARCHAR(45)
  user_agent: TEXT
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  INDEX(event_type)
  INDEX(created_at)
}
```

### 26. **REVIEWS_RATINGS**
```sql
reviews_ratings {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  customer_id: INTEGER
  order_id: INTEGER
  overall_rating: INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5)
  food_rating: INTEGER CHECK (food_rating >= 1 AND food_rating <= 5)
  service_rating: INTEGER CHECK (service_rating >= 1 AND service_rating <= 5)
  delivery_rating: INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5)
  review_text: TEXT
  guest_name: VARCHAR(255)
  guest_email: VARCHAR(255)
  is_verified: BOOLEAN DEFAULT FALSE
  is_public: BOOLEAN DEFAULT TRUE
  helpful_votes: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
}
```

### 27. **LOYALTY_PROGRAMS**
```sql
loyalty_programs {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  name: VARCHAR(255) NOT NULL
  description: TEXT
  points_per_rupee: DECIMAL(5,2) DEFAULT 1.00
  redemption_rate: DECIMAL(5,2) DEFAULT 1.00 -- points per rupee value
  minimum_redemption: INTEGER DEFAULT 100
  tier_thresholds: JSON -- Array of tier requirements
  tier_benefits: JSON -- Benefits for each tier
  birthday_bonus: INTEGER DEFAULT 0
  referral_bonus: INTEGER DEFAULT 0
  is_active: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
}
```

### 28. **LOYALTY_TRANSACTIONS**
```sql
loyalty_transactions {
  id: INTEGER PRIMARY KEY
  customer_id: INTEGER NOT NULL
  order_id: INTEGER
  transaction_type: ENUM('earned', 'redeemed', 'expired', 'bonus', 'adjustment') NOT NULL
  points: INTEGER NOT NULL
  description: VARCHAR(255)
  expiry_date: DATE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
}
```

### 29. **NOTIFICATIONS**
```sql
notifications {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  recipient_type: ENUM('customer', 'staff', 'admin') NOT NULL
  recipient_id: INTEGER
  type: ENUM('order_update', 'promotion', 'system', 'reminder') NOT NULL
  title: VARCHAR(255) NOT NULL
  message: TEXT NOT NULL
  channel: ENUM('email', 'sms', 'push', 'in_app') NOT NULL
  status: ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending'
  scheduled_at: TIMESTAMP
  sent_at: TIMESTAMP
  data: JSON -- Additional data for the notification
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
}
```

### 30. **SETTINGS**
```sql
settings {
  id: INTEGER PRIMARY KEY
  restaurant_id: INTEGER NOT NULL
  category: VARCHAR(100) NOT NULL -- e.g., "features", "notifications", "integrations"
  setting_key: VARCHAR(255) NOT NULL
  setting_value: JSON
  is_encrypted: BOOLEAN DEFAULT FALSE
  created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE(restaurant_id, category, setting_key)
}
```

## 🔗 Key Relationships Summary

### One-to-Many Relationships:
- **restaurants** → business_hours, categories, menu_items, customers, orders, staff, tables, etc.
- **categories** → menu_items
- **customers** → customer_addresses, orders, reviews_ratings, loyalty_transactions
- **orders** → order_items, payments, coupon_usage
- **menu_items** → menu_item_tags, menu_item_variations, order_items
- **staff** → staff_shifts

### Many-to-Many Relationships:
- **menu_items** ↔ **addons** (via menu_item_addons)
- **menu_items** ↔ **inventory** (via menu_item_ingredients)
- **order_items** ↔ **addons** (via order_item_addons)

### Self-Referencing Relationships:
- **customers** can refer to other customers (referral system)

## 📈 Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_orders_restaurant_date ON orders(restaurant_id, order_date);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_menu_items_available ON menu_items(is_available, restaurant_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_analytics_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_loyalty_transactions_customer ON loyalty_transactions(customer_id, created_at);
```

## 🔒 Data Security Considerations

1. **Encrypted Fields**: API keys, payment information
2. **Soft Deletes**: Important records use `is_active` flags
3. **Audit Trail**: All major tables have `created_at` and `updated_at`
4. **Access Control**: Role-based permissions in staff table
5. **Data Retention**: Configurable data retention policies

This ERD supports all the features we've designed including POS integration, loyalty programs, analytics, inventory management, and more!
