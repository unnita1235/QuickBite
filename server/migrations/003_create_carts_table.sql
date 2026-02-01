-- Migration: Create carts table for server-side cart persistence
-- QuickBite Database Migration - 003

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

-- Add trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;
CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
