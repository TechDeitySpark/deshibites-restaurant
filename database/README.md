# 🗄️ DeshiBites Database Documentation

## 📋 Overview
The DeshiBites database is designed to support a complete restaurant management system with features including menu management, order processing, customer management, POS integration, analytics, and more.

## 🏗️ Database Architecture

### Database Engine: MySQL 8.0+
### Character Set: utf8mb4_unicode_ci
### Database Name: `deshibites_db`

## 📊 Table Structure Summary

| Category | Tables | Purpose |
|----------|--------|---------|
| **Core Restaurant** | `restaurants`, `business_hours`, `settings` | Basic restaurant configuration |
| **Menu Management** | `categories`, `menu_items`, `menu_item_tags`, `menu_item_variations`, `addons`, `menu_item_addons` | Complete menu system |
| **Customer Management** | `customers`, `customer_addresses`, `loyalty_programs`, `loyalty_transactions` | Customer data and loyalty |
| **Order Management** | `orders`, `order_items`, `order_item_addons`, `payments`, `discounts_coupons`, `coupon_usage` | Order processing |
| **Inventory** | `inventory`, `menu_item_ingredients` | Stock management |
| **Staff & Operations** | `staff`, `staff_shifts`, `tables`, `reservations` | Restaurant operations |
| **POS Integration** | `pos_integrations`, `sync_logs` | External POS system sync |
| **Analytics** | `analytics_events`, `reviews_ratings` | Business intelligence |
| **Communication** | `notifications` | Customer and staff alerts |

## 🔗 Key Relationships

### Primary Relationships
```
restaurants (1) → (many) categories
categories (1) → (many) menu_items
customers (1) → (many) orders
orders (1) → (many) order_items
menu_items (1) → (many) order_items
restaurants (1) → (many) customers
restaurants (1) → (many) staff
```

### Many-to-Many Relationships
```
menu_items ↔ addons (via menu_item_addons)
menu_items ↔ inventory (via menu_item_ingredients)
order_items ↔ addons (via order_item_addons)
```

## 📈 Indexing Strategy

### Performance Indexes
- **Order Management**: `idx_orders_restaurant_date`, `idx_order_status`, `idx_payment_status`
- **Menu System**: `idx_available`, `idx_featured`, `idx_category_sort`
- **Customer Data**: `idx_loyalty_points`, `idx_total_spent`, `idx_email`
- **Analytics**: `idx_event_type`, `idx_created_at`
- **POS Integration**: `idx_pos_item_id`, `idx_pos_order_id`

### Unique Constraints
- `restaurants.email`
- `customers.phone` (per restaurant)
- `staff.employee_id` (per restaurant)
- `tables.table_number` (per restaurant)
- `discounts_coupons.code` (per restaurant)

## 🔒 Security Features

### Data Protection
1. **Encrypted Fields**: API keys, sensitive payment information
2. **Soft Deletes**: Use `is_active` flags instead of hard deletes
3. **Audit Trail**: All tables include `created_at` and `updated_at`
4. **Access Control**: Role-based permissions in staff table

### Data Validation
- CHECK constraints for ratings (1-5 scale)
- ENUM constraints for status fields
- NOT NULL constraints for critical fields
- Foreign key constraints for data integrity

## 📊 Business Logic Implementation

### Automatic Calculations
```sql
-- Customer Statistics Update Trigger
DELIMITER //
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
DELIMITER ;
```

### Loyalty Points System
- Automatic point calculation based on order amount
- Point expiry management
- Tier-based benefits system

### Inventory Management
- Automatic stock deduction on order completion
- Low stock alerts
- Recipe-based ingredient calculation

## 🎯 Key Features Supported

### 1. Multi-Location Support
- Single database supports multiple restaurant locations
- Location-specific menu items and pricing
- Centralized reporting with location filtering

### 2. POS Integration
- Support for multiple POS providers (Square, Toast, Clover, etc.)
- Bidirectional sync (menu, orders, payments)
- Sync logging and error tracking

### 3. Customer Experience
- Loyalty program with point earning/redemption
- Multiple address management
- Order history and favorites
- Review and rating system

### 4. Staff Management
- Role-based access control
- Shift scheduling and tracking
- Performance analytics

### 5. Analytics & Reporting
- Real-time event tracking
- Sales analytics by date/time/item
- Customer behavior analysis
- Staff performance metrics

## 📱 API Integration Points

### External Systems
```json
{
  "pos_systems": ["Square", "Toast", "Clover", "Lightspeed"],
  "payment_gateways": ["Razorpay", "PayU", "Stripe", "Square"],
  "delivery_partners": ["Zomato", "Swiggy", "Own Delivery"],
  "notification_channels": ["Email", "SMS", "Push", "In-App"]
}
```

## 🔄 Data Flow Examples

### Order Processing Flow
1. Customer places order → `orders` table
2. Order items added → `order_items` table
3. Addons selected → `order_item_addons` table
4. Payment processed → `payments` table
5. Loyalty points awarded → `loyalty_transactions` table
6. Inventory updated → `inventory` table (via ingredients)
7. Analytics tracked → `analytics_events` table

### POS Sync Flow
1. Menu sync initiated → `sync_logs` entry created
2. API call to POS system → External API
3. Data transformation → Application logic
4. Database update → `menu_items` table
5. Sync completion → `sync_logs` updated

## 📊 Sample Queries

### Daily Sales Report
```sql
SELECT 
    DATE(order_date) as sale_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value
FROM orders 
WHERE restaurant_id = 1 
    AND order_status = 'completed'
    AND order_date >= CURDATE() - INTERVAL 30 DAY
GROUP BY DATE(order_date)
ORDER BY sale_date DESC;
```

### Top Selling Items
```sql
SELECT 
    mi.name,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity,
    SUM(oi.total_price) as total_revenue
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.id
JOIN orders o ON oi.order_id = o.id
WHERE o.restaurant_id = 1 
    AND o.order_status = 'completed'
    AND o.order_date >= CURDATE() - INTERVAL 30 DAY
GROUP BY mi.id, mi.name
ORDER BY total_revenue DESC
LIMIT 10;
```

### Customer Loyalty Analysis
```sql
SELECT 
    CONCAT(first_name, ' ', last_name) as customer_name,
    total_orders,
    total_spent,
    loyalty_points,
    CASE 
        WHEN total_spent >= 10000 THEN 'Platinum'
        WHEN total_spent >= 5000 THEN 'Gold'
        WHEN total_spent >= 2000 THEN 'Silver'
        ELSE 'Bronze'
    END as tier
FROM customers 
WHERE restaurant_id = 1 
    AND is_active = TRUE
ORDER BY total_spent DESC;
```

## 🚀 Performance Optimization

### Query Optimization
- Use appropriate indexes for frequently queried columns
- Implement pagination for large result sets
- Use EXPLAIN to analyze query performance
- Cache frequently accessed data

### Database Maintenance
```sql
-- Regular maintenance tasks
ANALYZE TABLE menu_items, orders, customers;
OPTIMIZE TABLE analytics_events;
REPAIR TABLE IF NEEDED;
```

### Backup Strategy
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery capability
- Cross-region backup replication

## 📋 Migration Scripts

### Version Control
Database changes are tracked using migration scripts:
- `001_initial_schema.sql` - Initial database creation
- `002_add_indexes.sql` - Performance indexes
- `003_add_triggers.sql` - Business logic triggers
- `004_sample_data.sql` - Test data insertion

### Deployment Process
1. Backup current database
2. Run migration scripts in order
3. Verify data integrity
4. Update application configuration
5. Test critical functionality

## 🔍 Monitoring & Alerting

### Key Metrics to Monitor
- Query performance (slow query log)
- Connection pool usage
- Database size growth
- Backup completion status
- Replication lag (if applicable)

### Alert Conditions
- Query execution time > 5 seconds
- Connection pool > 80% utilization
- Failed backup jobs
- Low disk space (< 20%)
- Replication lag > 60 seconds

## 📚 References

### Documentation Links
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [Database Design Best Practices](https://dev.mysql.com/doc/mysql-tutorial-excerpt/8.0/en/)
- [Performance Tuning Guide](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

### Related Files
- `create_database.sql` - Database schema creation
- `sample_data.sql` - Sample data insertion
- `DeshiBites_ERD.md` - Entity Relationship Diagram
- `DeshiBites_ERD_Visual.mmd` - Visual ERD (Mermaid format)

---
**Database Version**: 1.0  
**Last Updated**: August 1, 2025  
**Maintained By**: DeshiBites Development Team
