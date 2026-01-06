-- QuickBite Database Migrations
-- Initial database schema setup

-- Drop existing tables if they exist (for fresh migration)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Create restaurants table
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cuisine_type VARCHAR(100),
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  delivery_time INT,
  delivery_charge DECIMAL(5,2),
  min_order DECIMAL(10,2),
  image_url VARCHAR(500),
  address TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active restaurants
CREATE INDEX idx_restaurants_active ON restaurants(is_active);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(5,2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
  delivery_address TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create indexes for order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Insert sample restaurants
INSERT INTO restaurants (name, description, cuisine_type, rating, delivery_time, delivery_charge, min_order, image_url, address, phone, is_active) VALUES
('Pasta Palace', 'Authentic Italian cuisine with fresh ingredients', 'Italian', 4.5, 35, 2.99, 15.00, 'https://images.unsplash.com/photo-1552521881-97d65e32ef12?w=500', '123 Main St', '555-0101', true),
('Sushi Spot', 'Premium Japanese sushi and ramen', 'Japanese', 4.8, 30, 3.99, 20.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500', '456 Oak Ave', '555-0102', true),
('Burger Barn', 'Juicy burgers and crispy fries', 'American', 4.3, 25, 2.49, 12.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', '789 Pine Rd', '555-0103', true),
('Taco Haven', 'Authentic Mexican street food', 'Mexican', 4.6, 20, 1.99, 10.00, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500', '321 Elm St', '555-0104', true),
('Pizza Place', 'Wood-fired pizza and fresh salads', 'Italian', 4.7, 30, 2.99, 18.00, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500', '654 Maple Dr', '555-0105', true),
('Curry Kitchen', 'Spicy Indian curries and breads', 'Indian', 4.4, 40, 3.49, 16.00, 'https://images.unsplash.com/photo-1585238341710-4b9c5c7c5d5e?w=500', '987 Cedar Ln', '555-0106', true);

-- Create sample user for testing
INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES
('test@example.com', '$2b$10$examplehashedpassword', 'Test', 'User', '555-0001');

-- Commit transaction
COMMIT;
