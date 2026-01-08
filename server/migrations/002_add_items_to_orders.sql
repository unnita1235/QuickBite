-- Migration: Add items column to orders table
-- QuickBite Database Migration - 002

-- Add items column to orders table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'items'
    ) THEN
        ALTER TABLE orders ADD COLUMN items JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Add comment explaining the structure
COMMENT ON COLUMN orders.items IS 'JSON array of order items: [{"id": 1, "name": "Item", "quantity": 2, "price": 10.50}, ...]';

-- Create index on items for faster queries (if not exists)
CREATE INDEX IF NOT EXISTS idx_orders_items ON orders USING GIN (items);

-- Add delivery_notes column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'delivery_notes'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_notes TEXT;
    END IF;
END $$;

-- Ensure updated_at trigger exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
