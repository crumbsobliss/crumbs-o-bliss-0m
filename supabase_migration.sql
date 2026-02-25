-- supabase_migration.sql

-- 1. Add new columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS calories TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discounted_price NUMERIC DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_veg BOOLEAN DEFAULT false;

-- 2. Create RPC function for atomic stock decrement
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity_to_subtract INT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensures stock never goes below 0 due to decrement
  UPDATE products
  SET stock = GREATEST(stock - quantity_to_subtract, 0)
  WHERE id = product_id;
END;
$$;
