-- DeshiBites Sample Data Insertion Script
-- This script populates the database with realistic sample data for testing

USE deshibites_db;

-- Sample Categories
INSERT INTO categories (restaurant_id, name, description, sort_order) VALUES
(1, 'Appetizers', 'Traditional Bengali starters and snacks', 1),
(1, 'Rice Dishes', 'Aromatic rice preparations with authentic spices', 2),
(1, 'Fish Curry', 'Fresh fish cooked in traditional Bengali style', 3),
(1, 'Chicken Dishes', 'Flavorful chicken preparations', 4),
(1, 'Vegetarian', 'Delicious vegetarian options', 5),
(1, 'Sweets', 'Traditional Bengali desserts', 6),
(1, 'Beverages', 'Refreshing drinks and traditional beverages', 7);

-- Sample Menu Items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, preparation_time, spice_level, is_featured) VALUES
-- Appetizers
(1, 1, 'Fish Fry', 'Crispy fried fish marinated with Bengali spices', 180.00, 15, 'medium', TRUE),
(1, 1, 'Beguni', 'Deep-fried eggplant fritters with gram flour batter', 120.00, 10, 'mild', FALSE),
(1, 1, 'Aloo Kabli', 'Spiced potato chaat with tangy chutneys', 100.00, 8, 'medium', FALSE),

-- Rice Dishes
(1, 2, 'Mutton Biryani', 'Aromatic basmati rice cooked with tender mutton pieces', 350.00, 45, 'medium', TRUE),
(1, 2, 'Chicken Biryani', 'Fragrant rice with marinated chicken and traditional spices', 280.00, 40, 'medium', TRUE),
(1, 2, 'Vegetable Pulao', 'Aromatic rice with mixed vegetables and whole spices', 180.00, 25, 'mild', FALSE),

-- Fish Curry
(1, 3, 'Hilsa Fish Curry', 'King fish cooked in traditional mustard gravy', 420.00, 30, 'medium', TRUE),
(1, 3, 'Rohu Fish Curry', 'Fresh rohu fish in Bengali-style curry', 320.00, 25, 'medium', FALSE),
(1, 3, 'Prawn Malai Curry', 'Prawns in creamy coconut curry', 380.00, 20, 'mild', TRUE),

-- Chicken Dishes
(1, 4, 'Chicken Curry', 'Traditional Bengali chicken curry with potatoes', 240.00, 35, 'medium', FALSE),
(1, 4, 'Chicken Kosha', 'Slow-cooked chicken in rich, thick gravy', 280.00, 40, 'hot', TRUE),
(1, 4, 'Butter Chicken', 'Creamy tomato-based chicken curry', 320.00, 25, 'mild', FALSE),

-- Vegetarian
(1, 5, 'Aloo Posto', 'Potatoes cooked with poppy seed paste', 150.00, 20, 'mild', FALSE),
(1, 5, 'Shukto', 'Mixed vegetable curry with bitter gourd', 180.00, 25, 'mild', TRUE),
(1, 5, 'Dal Tadka', 'Yellow lentils tempered with spices', 120.00, 15, 'mild', FALSE),

-- Sweets
(1, 6, 'Rasgulla', 'Soft cottage cheese balls in sugar syrup', 80.00, 5, 'none', TRUE),
(1, 6, 'Mishti Doi', 'Traditional Bengali sweet yogurt', 60.00, 2, 'none', FALSE),
(1, 6, 'Sandesh', 'Classic Bengali sweet made from cottage cheese', 100.00, 3, 'none', FALSE),

-- Beverages
(1, 7, 'Masala Chai', 'Traditional spiced tea', 40.00, 5, 'mild', FALSE),
(1, 7, 'Lassi', 'Refreshing yogurt-based drink', 60.00, 3, 'none', FALSE),
(1, 7, 'Fresh Lime Water', 'Freshly squeezed lime with mint', 50.00, 2, 'none', FALSE);

-- Add tags to menu items
INSERT INTO menu_item_tags (menu_item_id, tag) VALUES
(1, 'popular'), (1, 'spicy'),
(2, 'vegetarian'), (2, 'popular'),
(3, 'vegetarian'), (3, 'spicy'),
(4, 'popular'), (4, 'chef_special'),
(5, 'popular'),
(7, 'popular'), (7, 'chef_special'),
(9, 'popular'), (9, 'spicy'),
(10, 'chef_special'), (10, 'spicy'),
(12, 'vegetarian'),
(13, 'vegetarian'), (13, 'chef_special'),
(14, 'vegetarian'),
(15, 'popular'), (15, 'new'),
(16, 'popular');

-- Sample Addons
INSERT INTO addons (restaurant_id, name, price, category) VALUES
(1, 'Extra Rice', 30.00, 'Sides'),
(1, 'Papad', 20.00, 'Sides'),
(1, 'Pickle', 15.00, 'Sides'),
(1, 'Raita', 40.00, 'Sides'),
(1, 'Extra Gravy', 25.00, 'Extras'),
(1, 'Butter Naan', 45.00, 'Bread'),
(1, 'Tandoori Roti', 35.00, 'Bread'),
(1, 'Extra Spicy', 0.00, 'Customization'),
(1, 'Less Spicy', 0.00, 'Customization'),
(1, 'Extra Onions', 10.00, 'Extras');

-- Link addons to menu items
INSERT INTO menu_item_addons (menu_item_id, addon_id, is_required, max_quantity) VALUES
-- Rice dishes can have bread
(4, 6, FALSE, 2), (4, 7, FALSE, 2),
(5, 6, FALSE, 2), (5, 7, FALSE, 2),
(6, 6, FALSE, 2), (6, 7, FALSE, 2),
-- Curries can have rice and bread
(7, 1, FALSE, 2), (7, 6, FALSE, 2), (7, 7, FALSE, 2),
(8, 1, FALSE, 2), (8, 6, FALSE, 2), (8, 7, FALSE, 2),
(9, 1, FALSE, 2), (9, 6, FALSE, 2), (9, 7, FALSE, 2),
-- All dishes can have sides
(4, 2, FALSE, 3), (4, 3, FALSE, 2), (4, 4, FALSE, 1),
(5, 2, FALSE, 3), (5, 3, FALSE, 2), (5, 4, FALSE, 1),
-- Spice customization for all non-sweet items
(1, 8, FALSE, 1), (1, 9, FALSE, 1),
(4, 8, FALSE, 1), (4, 9, FALSE, 1),
(5, 8, FALSE, 1), (5, 9, FALSE, 1),
(7, 8, FALSE, 1), (7, 9, FALSE, 1),
(8, 8, FALSE, 1), (8, 9, FALSE, 1),
(9, 8, FALSE, 1), (9, 9, FALSE, 1),
(10, 8, FALSE, 1), (10, 9, FALSE, 1),
(11, 8, FALSE, 1), (11, 9, FALSE, 1);

-- Sample Menu Item Variations
INSERT INTO menu_item_variations (menu_item_id, name, price_adjustment, is_default) VALUES
(4, 'Half Plate', -80.00, FALSE),
(4, 'Full Plate', 0.00, TRUE),
(4, 'Family Pack', 200.00, FALSE),
(5, 'Half Plate', -60.00, FALSE),
(5, 'Full Plate', 0.00, TRUE),
(5, 'Family Pack', 150.00, FALSE),
(17, 'Small', -10.00, FALSE),
(17, 'Medium', 0.00, TRUE),
(17, 'Large', 15.00, FALSE),
(18, 'Sweet', 0.00, TRUE),
(18, 'Salted', 0.00, FALSE),
(18, 'Mango', 20.00, FALSE);

-- Sample Customers
INSERT INTO customers (restaurant_id, first_name, last_name, email, phone, loyalty_points, total_orders, total_spent) VALUES
(1, 'Rajesh', 'Kumar', 'rajesh.kumar@email.com', '+91 9876543210', 450, 12, 4200.00),
(1, 'Priya', 'Sharma', 'priya.sharma@email.com', '+91 9876543211', 320, 8, 2800.00),
(1, 'Amit', 'Das', 'amit.das@email.com', '+91 9876543212', 180, 5, 1650.00),
(1, 'Sneha', 'Roy', 'sneha.roy@email.com', '+91 9876543213', 720, 18, 6500.00),
(1, 'Arjun', 'Banerjee', 'arjun.banerjee@email.com', '+91 9876543214', 95, 3, 950.00),
(1, 'Ritu', 'Ghosh', 'ritu.ghosh@email.com', '+91 9876543215', 280, 7, 2450.00);

-- Sample Customer Addresses
INSERT INTO customer_addresses (customer_id, label, street_address, city, state, postal_code, is_default) VALUES
(1, 'Home', '45 Park Street', 'Kolkata', 'West Bengal', '700016', TRUE),
(1, 'Office', 'Salt Lake Sector V, Block EP', 'Kolkata', 'West Bengal', '700091', FALSE),
(2, 'Home', '123 Rashbehari Avenue', 'Kolkata', 'West Bengal', '700019', TRUE),
(3, 'Home', '67 Gariahat Road', 'Kolkata', 'West Bengal', '700019', TRUE),
(4, 'Home', '89 Ballygunge Place', 'Kolkata', 'West Bengal', '700019', TRUE),
(4, 'Office', 'New Town Action Area II', 'Kolkata', 'West Bengal', '700156', FALSE),
(5, 'Home', '34 Jadavpur Main Road', 'Kolkata', 'West Bengal', '700032', TRUE),
(6, 'Home', '56 Bhowanipore Lane', 'Kolkata', 'West Bengal', '700025', TRUE);

-- Sample Tables
INSERT INTO tables (restaurant_id, table_number, capacity, location, status) VALUES
(1, 'T01', 2, 'Ground Floor', 'available'),
(1, 'T02', 4, 'Ground Floor', 'available'),
(1, 'T03', 4, 'Ground Floor', 'occupied'),
(1, 'T04', 6, 'Ground Floor', 'available'),
(1, 'T05', 2, 'First Floor', 'available'),
(1, 'T06', 4, 'First Floor', 'available'),
(1, 'T07', 8, 'First Floor', 'reserved'),
(1, 'T08', 4, 'Terrace', 'available'),
(1, 'T09', 6, 'Terrace', 'available'),
(1, 'T10', 2, 'Terrace', 'maintenance');

-- Sample Orders
INSERT INTO orders (restaurant_id, customer_id, order_number, order_type, order_status, payment_status, subtotal, tax_amount, total_amount, table_number, order_date) VALUES
(1, 1, 'ORD001', 'dine_in', 'completed', 'paid', 520.00, 46.80, 566.80, 'T02', '2025-07-31 19:30:00'),
(1, 2, 'ORD002', 'delivery', 'delivered', 'paid', 680.00, 61.20, 741.20, NULL, '2025-07-31 20:15:00'),
(1, 3, 'ORD003', 'takeaway', 'ready', 'paid', 340.00, 30.60, 370.60, NULL, '2025-08-01 12:30:00'),
(1, 4, 'ORD004', 'dine_in', 'preparing', 'paid', 890.00, 80.10, 970.10, 'T07', '2025-08-01 13:15:00'),
(1, NULL, 'ORD005', 'delivery', 'confirmed', 'pending', 450.00, 40.50, 490.50, NULL, '2025-08-01 14:00:00');

-- Update guest info for order without customer
UPDATE orders SET guest_name = 'Rohit Singh', guest_phone = '+91 9876543299', guest_email = 'rohit.singh@email.com' WHERE id = 5;

-- Sample Order Items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price) VALUES
-- Order 1 (ORD001)
(1, 4, 1, 350.00, 350.00),  -- Mutton Biryani
(1, 1, 1, 180.00, 180.00),  -- Fish Fry
-- Order 2 (ORD002)  
(2, 5, 2, 280.00, 560.00),  -- Chicken Biryani x2
(2, 15, 2, 80.00, 160.00),  -- Rasgulla x2
-- Order 3 (ORD003)
(3, 7, 1, 420.00, 420.00),  -- Hilsa Fish Curry
-- Order 4 (ORD004)
(4, 4, 1, 350.00, 350.00),  -- Mutton Biryani
(4, 9, 1, 380.00, 380.00),  -- Prawn Malai Curry
(4, 2, 2, 120.00, 240.00),  -- Beguni x2
-- Order 5 (ORD005)
(5, 5, 1, 280.00, 280.00),  -- Chicken Biryani
(5, 13, 1, 180.00, 180.00); -- Shukto

-- Sample Order Item Addons
INSERT INTO order_item_addons (order_item_id, addon_id, quantity, unit_price, total_price) VALUES
(1, 2, 2, 20.00, 40.00),  -- Papad x2 for Mutton Biryani
(1, 4, 1, 40.00, 40.00),  -- Raita for Mutton Biryani
(3, 6, 2, 45.00, 90.00),  -- Butter Naan x2 for Chicken Biryani
(5, 1, 1, 30.00, 30.00),  -- Extra Rice for Hilsa Fish Curry
(6, 6, 1, 45.00, 45.00),  -- Butter Naan for Mutton Biryani
(7, 1, 1, 30.00, 30.00);  -- Extra Rice for Prawn Malai Curry

-- Sample Payments
INSERT INTO payments (order_id, payment_method, amount, currency, payment_status, transaction_id, processed_at) VALUES
(1, 'card', 566.80, 'INR', 'completed', 'TXN_001_2025073119', '2025-07-31 19:32:00'),
(2, 'upi', 741.20, 'INR', 'completed', 'UPI_002_2025073120', '2025-07-31 20:16:00'),
(3, 'cash', 370.60, 'INR', 'completed', 'CASH_003_2025080112', '2025-08-01 12:32:00'),
(4, 'card', 970.10, 'INR', 'completed', 'TXN_004_2025080113', '2025-08-01 13:17:00'),
(5, 'online', 490.50, 'INR', 'pending', 'ONLINE_005_2025080114', NULL);

-- Sample Discounts/Coupons
INSERT INTO discounts_coupons (restaurant_id, code, name, description, discount_type, discount_value, minimum_order_amount, usage_limit, start_date, end_date) VALUES
(1, 'WELCOME20', 'Welcome Offer', 'Get 20% off on your first order', 'percentage', 20.00, 300.00, 100, '2025-08-01 00:00:00', '2025-08-31 23:59:59'),
(1, 'FLAT100', 'Flat ₹100 Off', 'Get flat ₹100 off on orders above ₹500', 'fixed_amount', 100.00, 500.00, 200, '2025-08-01 00:00:00', '2025-08-15 23:59:59'),
(1, 'FREEDELIVERY', 'Free Delivery', 'Free delivery on all orders', 'free_delivery', 50.00, 200.00, 500, '2025-08-01 00:00:00', '2025-08-31 23:59:59'),
(1, 'BIRYANI50', 'Biryani Special', 'Get ₹50 off on Biryani orders', 'fixed_amount', 50.00, 250.00, 150, '2025-08-01 00:00:00', '2025-08-10 23:59:59');

-- Sample Staff
INSERT INTO staff (restaurant_id, employee_id, first_name, last_name, email, phone, role, hire_date, salary) VALUES
(1, 'EMP001', 'Ravi', 'Mondal', 'ravi.mondal@deshibites.com', '+91 9876501001', 'admin', '2024-01-15', 45000.00),
(1, 'EMP002', 'Sunita', 'Das', 'sunita.das@deshibites.com', '+91 9876501002', 'manager', '2024-02-01', 35000.00),
(1, 'EMP003', 'Kamal', 'Chef', 'kamal.chef@deshibites.com', '+91 9876501003', 'chef', '2024-02-15', 30000.00),
(1, 'EMP004', 'Anita', 'Roy', 'anita.roy@deshibites.com', '+91 9876501004', 'waiter', '2024-03-01', 18000.00),
(1, 'EMP005', 'Suresh', 'Kumar', 'suresh.kumar@deshibites.com', '+91 9876501005', 'waiter', '2024-03-15', 18000.00),
(1, 'EMP006', 'Meera', 'Singh', 'meera.singh@deshibites.com', '+91 9876501006', 'cashier', '2024-04-01', 22000.00),
(1, 'EMP007', 'Raju', 'Delivery', 'raju.delivery@deshibites.com', '+91 9876501007', 'delivery', '2024-04-15', 15000.00);

-- Sample Inventory
INSERT INTO inventory (restaurant_id, item_name, category, unit, current_stock, minimum_stock, cost_per_unit, supplier) VALUES
(1, 'Basmati Rice', 'Grains', 'kg', 50.00, 10.00, 80.00, 'Bengal Rice Suppliers'),
(1, 'Chicken', 'Meat', 'kg', 25.00, 5.00, 180.00, 'Fresh Meat Co.'),
(1, 'Mutton', 'Meat', 'kg', 15.00, 3.00, 420.00, 'Fresh Meat Co.'),
(1, 'Hilsa Fish', 'Fish', 'kg', 8.00, 2.00, 800.00, 'Fish Market Direct'),
(1, 'Rohu Fish', 'Fish', 'kg', 12.00, 3.00, 300.00, 'Fish Market Direct'),
(1, 'Prawns', 'Seafood', 'kg', 6.00, 2.00, 600.00, 'Coastal Seafood'),
(1, 'Onions', 'Vegetables', 'kg', 30.00, 5.00, 25.00, 'Veggie Fresh'),
(1, 'Tomatoes', 'Vegetables', 'kg', 20.00, 5.00, 35.00, 'Veggie Fresh'),
(1, 'Potatoes', 'Vegetables', 'kg', 40.00, 10.00, 20.00, 'Veggie Fresh'),
(1, 'Mustard Oil', 'Cooking Oil', 'liters', 15.00, 3.00, 120.00, 'Bengal Oil Mills'),
(1, 'Paneer', 'Dairy', 'kg', 8.00, 2.00, 250.00, 'Daily Fresh Dairy'),
(1, 'Yogurt', 'Dairy', 'kg', 10.00, 3.00, 60.00, 'Daily Fresh Dairy');

-- Sample Reviews
INSERT INTO reviews_ratings (restaurant_id, customer_id, order_id, overall_rating, food_rating, service_rating, review_text) VALUES
(1, 1, 1, 5, 5, 5, 'Amazing authentic Bengali food! The mutton biryani was absolutely delicious and perfectly spiced.'),
(1, 2, 2, 4, 5, 4, 'Great food quality and taste. Delivery was on time. The chicken biryani reminded me of home-cooked meals.'),
(1, 3, NULL, 5, 5, 5, 'Best Bengali restaurant in the city! Every dish tastes authentic and fresh. Highly recommended!'),
(1, 4, 4, 4, 4, 5, 'Wonderful dining experience. The staff was very courteous and the food arrived quickly.'),
(1, 6, NULL, 5, 5, 4, 'Love the traditional flavors! The hilsa fish curry is exactly like my grandmother used to make.');

-- Sample Analytics Events
INSERT INTO analytics_events (restaurant_id, event_type, event_data, user_id, user_type) VALUES
(1, 'menu_viewed', '{"menu_item_id": 4, "category": "Rice Dishes"}', 1, 'customer'),
(1, 'order_placed', '{"order_id": 1, "total_amount": 566.80, "order_type": "dine_in"}', 1, 'customer'),
(1, 'menu_viewed', '{"menu_item_id": 7, "category": "Fish Curry"}', 2, 'customer'),
(1, 'order_placed', '{"order_id": 2, "total_amount": 741.20, "order_type": "delivery"}', 2, 'customer'),
(1, 'payment_completed', '{"payment_id": 1, "method": "card", "amount": 566.80}', 1, 'customer'),
(1, 'staff_login', '{"staff_id": 1, "role": "admin"}', 1, 'staff'),
(1, 'order_status_updated', '{"order_id": 1, "old_status": "preparing", "new_status": "ready"}', 3, 'staff');

-- Sample Loyalty Program
INSERT INTO loyalty_programs (restaurant_id, name, description, points_per_rupee, redemption_rate, minimum_redemption) VALUES
(1, 'DeshiBites Rewards', 'Earn points on every order and redeem for discounts', 1.00, 0.50, 100);

-- Sample Loyalty Transactions
INSERT INTO loyalty_transactions (customer_id, order_id, transaction_type, points, description) VALUES
(1, 1, 'earned', 567, 'Points earned from order ORD001'),
(2, 2, 'earned', 741, 'Points earned from order ORD002'),
(3, 3, 'earned', 371, 'Points earned from order ORD003'),
(4, 4, 'earned', 970, 'Points earned from order ORD004'),
(1, NULL, 'bonus', 50, 'Birthday bonus points'),
(4, NULL, 'redeemed', -200, 'Redeemed points for discount');

-- Sample Reservations
INSERT INTO reservations (restaurant_id, customer_id, table_id, guest_name, guest_phone, party_size, reservation_date, reservation_time, status) VALUES
(1, 1, 7, 'Rajesh Kumar', '+91 9876543210', 6, '2025-08-02', '19:00:00', 'confirmed'),
(1, 4, 4, 'Sneha Roy', '+91 9876543213', 4, '2025-08-01', '20:30:00', 'confirmed'),
(1, NULL, 2, 'Vikash Gupta', '+91 9876543220', 3, '2025-08-03', '13:00:00', 'pending');

-- Sample Settings
INSERT INTO settings (restaurant_id, category, setting_key, setting_value) VALUES
(1, 'features', 'online_ordering', 'true'),
(1, 'features', 'table_reservations', 'true'),
(1, 'features', 'delivery_service', 'true'),
(1, 'features', 'loyalty_program', 'true'),
(1, 'notifications', 'email_notifications', 'true'),
(1, 'notifications', 'sms_notifications', 'true'),
(1, 'notifications', 'order_alerts', 'true'),
(1, 'integrations', 'payment_gateways', '["Razorpay", "PayU", "Stripe"]'),
(1, 'integrations', 'delivery_partners', '["Zomato", "Swiggy", "Own Delivery"]');

COMMIT;

-- Display summary
SELECT 'Database populated with sample data successfully!' as message;
SELECT 
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM menu_items) as menu_items_count,
    (SELECT COUNT(*) FROM customers) as customers_count,
    (SELECT COUNT(*) FROM orders) as orders_count,
    (SELECT COUNT(*) FROM staff) as staff_count,
    (SELECT COUNT(*) FROM inventory) as inventory_count;
