-- DeshiBites Restaurant Management System - Database Creation Script
-- Created: August 1, 2025
-- Description: Complete DDL script for creating all tables and relationships

-- Create Database
CREATE DATABASE IF NOT EXISTS deshibites_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE deshibites_db;

-- 1. RESTAURANTS (Main Entity)
CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    favicon_url VARCHAR(500),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    accent_color VARCHAR(7),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    website VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    twitter_url VARCHAR(500),
    youtube_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
);

-- 2. BUSINESS_HOURS
CREATE TABLE business_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_day (restaurant_id, day_of_week)
);

-- 3. CATEGORIES
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_active (restaurant_id, is_active),
    INDEX idx_sort_order (sort_order)
);

-- 4. MENU_ITEMS
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    preparation_time INT COMMENT 'in minutes',
    calories INT,
    spice_level ENUM('none', 'mild', 'medium', 'hot', 'very_hot'),
    pos_item_id VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_pos_item_id (pos_item_id),
    INDEX idx_available (is_available, restaurant_id),
    INDEX idx_featured (is_featured),
    INDEX idx_category_sort (category_id, sort_order)
);

-- 5. MENU_ITEM_TAGS
CREATE TABLE menu_item_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    tag ENUM('vegetarian', 'vegan', 'halal', 'spicy', 'popular', 'new', 'chef_special', 'gluten_free', 'dairy_free') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_tag (menu_item_id, tag),
    INDEX idx_tag (tag)
);

-- 6. MENU_ITEM_VARIATIONS
CREATE TABLE menu_item_variations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0.00,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- 7. ADDONS
CREATE TABLE addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_available (restaurant_id, is_available),
    INDEX idx_category (category)
);

-- 8. MENU_ITEM_ADDONS (Many-to-Many)
CREATE TABLE menu_item_addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    addon_id INT NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    max_quantity INT DEFAULT 1,
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_addon (menu_item_id, addon_id)
);

-- 9. CUSTOMERS
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    loyalty_points INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    favorite_items JSON,
    dietary_preferences JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_order_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_phone (restaurant_id, phone),
    INDEX idx_email (email),
    INDEX idx_loyalty_points (loyalty_points),
    INDEX idx_total_spent (total_spent)
);

-- 10. CUSTOMER_ADDRESSES
CREATE TABLE customer_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    label VARCHAR(100),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    delivery_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_default (customer_id, is_default),
    INDEX idx_location (latitude, longitude)
);

-- 11. ORDERS
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    customer_id INT,
    order_number VARCHAR(50) NOT NULL,
    order_type ENUM('dine_in', 'takeaway', 'delivery', 'online') NOT NULL,
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded') DEFAULT 'pending',
    
    -- Order Details
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tip_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Customer Info (for guest orders)
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_email VARCHAR(255),
    
    -- Delivery/Pickup Info
    delivery_address_id INT,
    delivery_instructions TEXT,
    estimated_delivery_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,
    table_number VARCHAR(10),
    
    -- Special Instructions
    special_instructions TEXT,
    
    -- POS Integration
    pos_order_id VARCHAR(100),
    pos_payment_id VARCHAR(100),
    
    -- Timestamps
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    prepared_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (delivery_address_id) REFERENCES customer_addresses(id) ON DELETE SET NULL,
    UNIQUE KEY unique_restaurant_order (restaurant_id, order_number),
    INDEX idx_pos_order_id (pos_order_id),
    INDEX idx_order_date (order_date),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status)
);

-- 12. ORDER_ITEMS
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    variation_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
    FOREIGN KEY (variation_id) REFERENCES menu_item_variations(id) ON DELETE SET NULL
);

-- 13. ORDER_ITEM_ADDONS
CREATE TABLE order_item_addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    addon_id INT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE RESTRICT
);

-- 14. PAYMENTS
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('cash', 'card', 'upi', 'wallet', 'online', 'pos') NOT NULL,
    payment_gateway VARCHAR(100),
    transaction_id VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    gateway_response JSON,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_gateway_transaction_id (gateway_transaction_id),
    INDEX idx_payment_status (payment_status)
);

-- 15. DISCOUNTS_COUPONS
CREATE TABLE discounts_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount', 'free_delivery') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount DECIMAL(10,2),
    usage_limit INT,
    usage_per_customer INT DEFAULT 1,
    current_usage INT DEFAULT 0,
    applicable_items JSON,
    customer_tiers JSON,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_code (restaurant_id, code),
    INDEX idx_active_dates (is_active, start_date, end_date)
);

-- 16. COUPON_USAGE
CREATE TABLE coupon_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    order_id INT NOT NULL,
    customer_id INT,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (coupon_id) REFERENCES discounts_coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_coupon_usage (coupon_id, used_at)
);

-- 17. INVENTORY
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(50),
    current_stock DECIMAL(10,3) NOT NULL,
    minimum_stock DECIMAL(10,3) DEFAULT 0,
    maximum_stock DECIMAL(10,3),
    cost_per_unit DECIMAL(10,2),
    supplier VARCHAR(255),
    last_restocked TIMESTAMP NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_category (restaurant_id, category),
    INDEX idx_low_stock (current_stock, minimum_stock),
    INDEX idx_expiry (expiry_date)
);

-- 18. MENU_ITEM_INGREDIENTS (Recipe Management)
CREATE TABLE menu_item_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    inventory_item_id INT NOT NULL,
    quantity_required DECIMAL(10,3) NOT NULL,
    unit VARCHAR(50),
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_item_ingredient (menu_item_id, inventory_item_id)
);

-- 19. STAFF
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'manager', 'chef', 'waiter', 'cashier', 'delivery') NOT NULL,
    permissions JSON,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_employee (restaurant_id, employee_id),
    UNIQUE KEY unique_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- 20. STAFF_SHIFTS
CREATE TABLE staff_shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INT DEFAULT 0 COMMENT 'in minutes',
    actual_start_time TIME,
    actual_end_time TIME,
    hours_worked DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status ENUM('scheduled', 'started', 'on_break', 'completed', 'absent') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    INDEX idx_staff_date (staff_id, shift_date),
    INDEX idx_status (status)
);

-- 21. TABLES
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    table_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(100),
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    qr_code VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_table (restaurant_id, table_number),
    INDEX idx_status (status),
    INDEX idx_capacity (capacity)
);

-- 22. RESERVATIONS
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    customer_id INT,
    table_id INT,
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20) NOT NULL,
    guest_email VARCHAR(255),
    party_size INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    duration INT DEFAULT 120 COMMENT 'in minutes',
    status ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    special_requests TEXT,
    confirmed_at TIMESTAMP NULL,
    seated_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL,
    INDEX idx_restaurant_date (restaurant_id, reservation_date),
    INDEX idx_status (status),
    INDEX idx_party_size (party_size)
);

-- 23. POS_INTEGRATIONS
CREATE TABLE pos_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    provider ENUM('square', 'toast', 'clover', 'lightspeed', 'touchbistro') NOT NULL,
    merchant_id VARCHAR(255),
    location_id VARCHAR(255),
    api_key_encrypted TEXT,
    environment ENUM('sandbox', 'production') DEFAULT 'sandbox',
    webhook_url VARCHAR(500),
    is_active BOOLEAN DEFAULT FALSE,
    last_sync TIMESTAMP NULL,
    sync_status ENUM('success', 'error', 'pending') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_provider (provider),
    INDEX idx_active (is_active)
);

-- 24. SYNC_LOGS
CREATE TABLE sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    pos_integration_id INT NOT NULL,
    sync_type ENUM('menu', 'orders', 'payments', 'inventory') NOT NULL,
    sync_direction ENUM('import', 'export', 'bidirectional') NOT NULL,
    status ENUM('started', 'completed', 'failed') NOT NULL,
    records_processed INT DEFAULT 0,
    records_successful INT DEFAULT 0,
    records_failed INT DEFAULT 0,
    error_details JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (pos_integration_id) REFERENCES pos_integrations(id) ON DELETE CASCADE,
    INDEX idx_sync_type_date (sync_type, started_at),
    INDEX idx_status (status)
);

-- 25. ANALYTICS_EVENTS
CREATE TABLE analytics_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    user_id INT,
    user_type ENUM('customer', 'staff', 'guest'),
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at),
    INDEX idx_user_type_id (user_type, user_id)
);

-- 26. REVIEWS_RATINGS
CREATE TABLE reviews_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    customer_id INT,
    order_id INT,
    overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    food_rating INT CHECK (food_rating >= 1 AND food_rating <= 5),
    service_rating INT CHECK (service_rating >= 1 AND service_rating <= 5),
    delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    review_text TEXT,
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_overall_rating (overall_rating),
    INDEX idx_verified_public (is_verified, is_public),
    INDEX idx_created_at (created_at)
);

-- 27. LOYALTY_PROGRAMS
CREATE TABLE loyalty_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_per_rupee DECIMAL(5,2) DEFAULT 1.00,
    redemption_rate DECIMAL(5,2) DEFAULT 1.00,
    minimum_redemption INT DEFAULT 100,
    tier_thresholds JSON,
    tier_benefits JSON,
    birthday_bonus INT DEFAULT 0,
    referral_bonus INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_active (is_active)
);

-- 28. LOYALTY_TRANSACTIONS
CREATE TABLE loyalty_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_id INT,
    transaction_type ENUM('earned', 'redeemed', 'expired', 'bonus', 'adjustment') NOT NULL,
    points INT NOT NULL,
    description VARCHAR(255),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_customer_type (customer_id, transaction_type),
    INDEX idx_expiry (expiry_date),
    INDEX idx_created_at (created_at)
);

-- 29. NOTIFICATIONS
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    recipient_type ENUM('customer', 'staff', 'admin') NOT NULL,
    recipient_id INT,
    type ENUM('order_update', 'promotion', 'system', 'reminder') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_recipient (recipient_type, recipient_id),
    INDEX idx_status_scheduled (status, scheduled_at),
    INDEX idx_type (type)
);

-- 30. SETTINGS
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    setting_key VARCHAR(255) NOT NULL,
    setting_value JSON,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_setting (restaurant_id, category, setting_key),
    INDEX idx_category (category)
);

-- Create additional performance indexes
CREATE INDEX idx_orders_restaurant_date ON orders(restaurant_id, order_date);
CREATE INDEX idx_menu_items_featured ON menu_items(is_featured, restaurant_id);
CREATE INDEX idx_customers_loyalty ON customers(loyalty_points DESC);
CREATE INDEX idx_inventory_low_stock ON inventory(restaurant_id, current_stock, minimum_stock);
CREATE INDEX idx_reservations_datetime ON reservations(reservation_date, reservation_time);

-- Add triggers for automatic calculations (optional)
DELIMITER //

-- Trigger to update customer total_orders and total_spent
CREATE TRIGGER update_customer_stats 
AFTER UPDATE ON orders 
FOR EACH ROW 
BEGIN
    IF NEW.order_status = 'completed' AND OLD.order_status != 'completed' THEN
        UPDATE customers 
        SET 
            total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            last_order_date = NEW.completed_at
        WHERE id = NEW.customer_id;
    END IF;
END//

-- Trigger to update coupon usage count
CREATE TRIGGER update_coupon_usage 
AFTER INSERT ON coupon_usage 
FOR EACH ROW 
BEGIN
    UPDATE discounts_coupons 
    SET current_usage = current_usage + 1 
    WHERE id = NEW.coupon_id;
END//

DELIMITER ;

-- Insert sample data for a restaurant
INSERT INTO restaurants (name, tagline, description, phone, email, address) 
VALUES (
    'DeshiBites', 
    'Authentic Bengali Flavors', 
    'Experience the authentic taste of Bengal with our traditional recipes and modern cooking techniques.',
    '+91 98765 43210',
    'contact@deshibites.com',
    '123 Food Street, Kolkata, West Bengal 700001'
);

-- Add sample business hours
INSERT INTO business_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
(1, 'monday', '10:00:00', '22:00:00'),
(1, 'tuesday', '10:00:00', '22:00:00'),
(1, 'wednesday', '10:00:00', '22:00:00'),
(1, 'thursday', '10:00:00', '22:00:00'),
(1, 'friday', '10:00:00', '23:00:00'),
(1, 'saturday', '10:00:00', '23:00:00'),
(1, 'sunday', '11:00:00', '22:00:00');

-- Create views for common queries
CREATE VIEW menu_items_with_category AS
SELECT 
    mi.*,
    c.name as category_name,
    c.description as category_description
FROM menu_items mi
JOIN categories c ON mi.category_id = c.id
WHERE mi.is_available = TRUE AND c.is_active = TRUE;

CREATE VIEW order_summary AS
SELECT 
    o.*,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    c.phone as customer_phone,
    c.email as customer_email
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;

CREATE VIEW daily_sales_summary AS
SELECT 
    restaurant_id,
    DATE(order_date) as sale_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    SUM(CASE WHEN order_type = 'delivery' THEN 1 ELSE 0 END) as delivery_orders,
    SUM(CASE WHEN order_type = 'dine_in' THEN 1 ELSE 0 END) as dine_in_orders,
    SUM(CASE WHEN order_type = 'takeaway' THEN 1 ELSE 0 END) as takeaway_orders
FROM orders 
WHERE order_status = 'completed'
GROUP BY restaurant_id, DATE(order_date);

COMMIT;
