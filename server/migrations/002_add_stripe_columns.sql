-- Migration: Add Stripe payment columns to orders table
-- Run this migration to support Stripe payment integration

-- Add new columns for Stripe integration
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_payment_intent VARCHAR(255);

-- Add index for faster lookup by stripe session id
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);

-- Update status check constraint to include pending_payment
-- First drop the existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
    ALTER TABLE orders DROP CONSTRAINT orders_status_check;
  END IF;
END $$;

-- Add updated constraint with pending_payment status
ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'pending_payment', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'));
