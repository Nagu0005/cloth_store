-- Create Databases
CREATE DATABASE catalog_db;
CREATE DATABASE cart_db;
CREATE DATABASE checkout_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE shipping_db;
CREATE DATABASE email_db;
CREATE DATABASE recommendation_db;
CREATE DATABASE ad_db;
CREATE DATABASE currency_db;
CREATE DATABASE user_db;

-- Connect to catalog_db to seed initial products
\c catalog_db;

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    gst_percentage NUMERIC(5, 2) NOT NULL,
    image_url TEXT,
    description TEXT,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, brand, category, base_price, gst_percentage, image_url, description, stock) VALUES
('Classic Silk Saree', 'Royal Weaves', 'Women', 4500.00, 5.0, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', 'Handcrafted pure silk saree with traditional borders.', 50),
('Cotton Kurta Set', 'FabIndia Lifestyle', 'Men', 1800.00, 5.0, 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=800&auto=format&fit=crop', 'Comfortable cotton kurta with matching pyjamas for all occasions.', 100),
('Designer Leheriya Dupatta', 'Rajasthan Arts', 'Women', 750.00, 5.0, 'https://images.unsplash.com/photo-1583391733956-6c70273b0bb6?q=80&w=800&auto=format&fit=crop', 'Vibrant leheriya pattern dupatta with gota patti work.', 200),
('Kids Indo-Western Set', 'Tiny Trends', 'Kids', 1200.00, 5.0, 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop', 'Stylish Indo-western outfit for kids celebrations.', 150),
('Linen Summer Shirt', 'Linen Club', 'Men', 2500.00, 5.0, 'https://images.unsplash.com/photo-1594932224030-940356ed269f?q=80&w=800&auto=format&fit=crop', 'Premium linen shirt for a cool and breezy summer look.', 75);
