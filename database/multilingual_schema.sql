-- DeshiBites Multilingual Support - Database Extension
-- Adding internationalization (i18n) support for English and German

USE deshibites_db;

-- 1. LANGUAGES TABLE
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE, -- 'en', 'de', 'en-US', 'de-DE'
    name VARCHAR(100) NOT NULL, -- 'English', 'Deutsch'
    native_name VARCHAR(100) NOT NULL, -- 'English', 'Deutsch'
    direction ENUM('ltr', 'rtl') DEFAULT 'ltr',
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (is_active)
);

-- Insert supported languages
INSERT INTO languages (code, name, native_name, is_active, is_default) VALUES
('en', 'English', 'English', TRUE, TRUE),
('de', 'German', 'Deutsch', TRUE, FALSE);

-- 2. RESTAURANT TRANSLATIONS
CREATE TABLE restaurant_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255),
    tagline VARCHAR(500),
    description TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_language (restaurant_id, language_code)
);

-- 3. CATEGORY TRANSLATIONS
CREATE TABLE category_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_category_language (category_id, language_code)
);

-- 4. MENU ITEM TRANSLATIONS
CREATE TABLE menu_item_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_menu_item_language (menu_item_id, language_code),
    INDEX idx_language_code (language_code)
);

-- 5. ADDON TRANSLATIONS
CREATE TABLE addon_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    addon_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_addon_language (addon_id, language_code)
);

-- 6. MENU ITEM VARIATION TRANSLATIONS
CREATE TABLE menu_item_variation_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    variation_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (variation_id) REFERENCES menu_item_variations(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_variation_language (variation_id, language_code)
);

-- 7. USER LANGUAGE PREFERENCES
CREATE TABLE user_language_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type ENUM('customer', 'staff') NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_user_type (user_id, user_type),
    INDEX idx_user_type (user_type, user_id)
);

-- 8. STATIC CONTENT TRANSLATIONS (for UI elements)
CREATE TABLE static_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    translation_key VARCHAR(255) NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    translation_value TEXT NOT NULL,
    context VARCHAR(100), -- 'menu', 'ui', 'email', 'sms'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE,
    UNIQUE KEY unique_key_language (translation_key, language_code),
    INDEX idx_context (context),
    INDEX idx_translation_key (translation_key)
);

-- Add language preference to customers table
ALTER TABLE customers ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';
ALTER TABLE customers ADD FOREIGN KEY (preferred_language) REFERENCES languages(code);

-- Add language preference to staff table  
ALTER TABLE staff ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';
ALTER TABLE staff ADD FOREIGN KEY (preferred_language) REFERENCES languages(code);

-- Create views for multilingual data retrieval
DELIMITER //

-- Function to get translated content with fallback
CREATE FUNCTION get_translation(
    table_name VARCHAR(50),
    record_id INT,
    field_name VARCHAR(50),
    lang_code VARCHAR(5),
    fallback_lang VARCHAR(5)
) RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE result TEXT DEFAULT NULL;
    DECLARE fallback_result TEXT DEFAULT NULL;
    
    -- Try to get translation in requested language
    CASE table_name
        WHEN 'menu_items' THEN
            SELECT CASE field_name
                WHEN 'name' THEN name
                WHEN 'description' THEN description
            END INTO result
            FROM menu_item_translations
            WHERE menu_item_id = record_id AND language_code = lang_code;
            
        WHEN 'categories' THEN
            SELECT CASE field_name
                WHEN 'name' THEN name
                WHEN 'description' THEN description
            END INTO result
            FROM category_translations
            WHERE category_id = record_id AND language_code = lang_code;
            
        WHEN 'addons' THEN
            SELECT name INTO result
            FROM addon_translations
            WHERE addon_id = record_id AND language_code = lang_code;
    END CASE;
    
    -- If no translation found, try fallback language
    IF result IS NULL AND fallback_lang IS NOT NULL THEN
        CASE table_name
            WHEN 'menu_items' THEN
                SELECT CASE field_name
                    WHEN 'name' THEN name
                    WHEN 'description' THEN description
                END INTO fallback_result
                FROM menu_item_translations
                WHERE menu_item_id = record_id AND language_code = fallback_lang;
                
            WHEN 'categories' THEN
                SELECT CASE field_name
                    WHEN 'name' THEN name
                    WHEN 'description' THEN description
                END INTO fallback_result
                FROM category_translations
                WHERE category_id = record_id AND language_code = fallback_lang;
                
            WHEN 'addons' THEN
                SELECT name INTO fallback_result
                FROM addon_translations
                WHERE addon_id = record_id AND language_code = fallback_lang;
        END CASE;
        
        SET result = fallback_result;
    END IF;
    
    RETURN result;
END//

DELIMITER ;

-- Create multilingual views
CREATE VIEW menu_items_multilingual AS
SELECT 
    mi.*,
    c.name as category_name,
    mt_en.name as name_en,
    mt_en.description as description_en,
    mt_de.name as name_de,
    mt_de.description as description_de,
    ct_en.name as category_name_en,
    ct_de.name as category_name_de
FROM menu_items mi
JOIN categories c ON mi.category_id = c.id
LEFT JOIN menu_item_translations mt_en ON mi.id = mt_en.menu_item_id AND mt_en.language_code = 'en'
LEFT JOIN menu_item_translations mt_de ON mi.id = mt_de.menu_item_id AND mt_de.language_code = 'de'
LEFT JOIN category_translations ct_en ON c.id = ct_en.category_id AND ct_en.language_code = 'en'
LEFT JOIN category_translations ct_de ON c.id = ct_de.category_id AND ct_de.language_code = 'de'
WHERE mi.is_available = TRUE AND c.is_active = TRUE;

-- Insert sample translations for DeshiBites
INSERT INTO restaurant_translations (restaurant_id, language_code, name, tagline, description, address) VALUES
(1, 'en', 'DeshiBites', 'Authentic Bengali Flavors', 'Experience the authentic taste of Bengal with our traditional recipes and modern cooking techniques.', '123 Food Street, Kolkata, West Bengal 700001'),
(1, 'de', 'DeshiBites', 'Authentische bengalische Aromen', 'Erleben Sie den authentischen Geschmack Bengalens mit unseren traditionellen Rezepten und modernen Kochtechniken.', '123 Food Street, Kolkata, West Bengal 700001');

-- Insert sample static translations for common UI elements
INSERT INTO static_translations (translation_key, language_code, translation_value, context) VALUES
-- Navigation
('nav.home', 'en', 'Home', 'ui'),
('nav.home', 'de', 'Startseite', 'ui'),
('nav.menu', 'en', 'Menu', 'ui'),
('nav.menu', 'de', 'Speisekarte', 'ui'),
('nav.orders', 'en', 'Orders', 'ui'),
('nav.orders', 'de', 'Bestellungen', 'ui'),
('nav.customers', 'en', 'Customers', 'ui'),
('nav.customers', 'de', 'Kunden', 'ui'),
('nav.analytics', 'en', 'Analytics', 'ui'),
('nav.analytics', 'de', 'Analytik', 'ui'),
('nav.settings', 'en', 'Settings', 'ui'),
('nav.settings', 'de', 'Einstellungen', 'ui'),

-- Order statuses
('order.status.pending', 'en', 'Pending', 'ui'),
('order.status.pending', 'de', 'Ausstehend', 'ui'),
('order.status.confirmed', 'en', 'Confirmed', 'ui'),
('order.status.confirmed', 'de', 'Bestätigt', 'ui'),
('order.status.preparing', 'en', 'Preparing', 'ui'),
('order.status.preparing', 'de', 'In Zubereitung', 'ui'),
('order.status.ready', 'en', 'Ready', 'ui'),
('order.status.ready', 'de', 'Bereit', 'ui'),
('order.status.delivered', 'en', 'Delivered', 'ui'),
('order.status.delivered', 'de', 'Geliefert', 'ui'),
('order.status.completed', 'en', 'Completed', 'ui'),
('order.status.completed', 'de', 'Abgeschlossen', 'ui'),

-- Common actions
('action.add', 'en', 'Add', 'ui'),
('action.add', 'de', 'Hinzufügen', 'ui'),
('action.edit', 'en', 'Edit', 'ui'),
('action.edit', 'de', 'Bearbeiten', 'ui'),
('action.delete', 'en', 'Delete', 'ui'),
('action.delete', 'de', 'Löschen', 'ui'),
('action.save', 'en', 'Save', 'ui'),
('action.save', 'de', 'Speichern', 'ui'),
('action.cancel', 'en', 'Cancel', 'ui'),
('action.cancel', 'de', 'Abbrechen', 'ui'),
('action.search', 'en', 'Search', 'ui'),
('action.search', 'de', 'Suchen', 'ui'),

-- Menu management
('menu.category.appetizers', 'en', 'Appetizers', 'menu'),
('menu.category.appetizers', 'de', 'Vorspeisen', 'menu'),
('menu.category.main_course', 'en', 'Main Course', 'menu'),
('menu.category.main_course', 'de', 'Hauptgang', 'menu'),
('menu.category.desserts', 'en', 'Desserts', 'menu'),
('menu.category.desserts', 'de', 'Nachspeisen', 'menu'),
('menu.category.beverages', 'en', 'Beverages', 'menu'),
('menu.category.beverages', 'de', 'Getränke', 'menu'),

-- Dietary tags
('tag.vegetarian', 'en', 'Vegetarian', 'menu'),
('tag.vegetarian', 'de', 'Vegetarisch', 'menu'),
('tag.vegan', 'en', 'Vegan', 'menu'),
('tag.vegan', 'de', 'Vegan', 'menu'),
('tag.halal', 'en', 'Halal', 'menu'),
('tag.halal', 'de', 'Halal', 'menu'),
('tag.spicy', 'en', 'Spicy', 'menu'),
('tag.spicy', 'de', 'Scharf', 'menu'),
('tag.popular', 'en', 'Popular', 'menu'),
('tag.popular', 'de', 'Beliebt', 'menu'),

-- Spice levels
('spice.none', 'en', 'No Spice', 'menu'),
('spice.none', 'de', 'Nicht scharf', 'menu'),
('spice.mild', 'en', 'Mild', 'menu'),
('spice.mild', 'de', 'Mild', 'menu'),
('spice.medium', 'en', 'Medium', 'menu'),
('spice.medium', 'de', 'Mittel', 'menu'),
('spice.hot', 'en', 'Hot', 'menu'),
('spice.hot', 'de', 'Scharf', 'menu'),
('spice.very_hot', 'en', 'Very Hot', 'menu'),
('spice.very_hot', 'de', 'Sehr scharf', 'menu'),

-- Email templates
('email.order_confirmation.subject', 'en', 'Order Confirmation - DeshiBites', 'email'),
('email.order_confirmation.subject', 'de', 'Bestellbestätigung - DeshiBites', 'email'),
('email.order_ready.subject', 'en', 'Your Order is Ready!', 'email'),
('email.order_ready.subject', 'de', 'Ihre Bestellung ist fertig!', 'email'),

-- POS Integration
('pos.connection.connected', 'en', 'Connected', 'ui'),
('pos.connection.connected', 'de', 'Verbunden', 'ui'),
('pos.connection.disconnected', 'en', 'Disconnected', 'ui'),
('pos.connection.disconnected', 'de', 'Getrennt', 'ui'),
('pos.sync.menu', 'en', 'Sync Menu', 'ui'),
('pos.sync.menu', 'de', 'Menü synchronisieren', 'ui'),
('pos.sync.orders', 'en', 'Sync Orders', 'ui'),
('pos.sync.orders', 'de', 'Bestellungen synchronisieren', 'ui');

COMMIT;

-- Show summary
SELECT 'Multilingual database schema created successfully!' as message;
SELECT 
    (SELECT COUNT(*) FROM languages) as supported_languages,
    (SELECT COUNT(*) FROM static_translations) as static_translations,
    (SELECT COUNT(*) FROM restaurant_translations) as restaurant_translations;
