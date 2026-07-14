-- ============================================================
-- BulkBazar Marketplace Migration
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- 1. Allow anyone (even logged-out visitors) to browse active products
CREATE POLICY "Anyone can browse active products"
  ON products FOR SELECT USING (status = 'active');

-- 2. Allow reading seller profile names (for product cards)
CREATE POLICY "Public can read seller profiles"
  ON profiles FOR SELECT USING (true);

-- 3. Add buyer_id to orders table (links orders to registered buyer accounts)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. Allow buyers to read their own orders
CREATE POLICY "Buyers can read own orders"
  ON orders FOR SELECT USING (auth.uid() = buyer_id);

-- 5. Allow buyers to create orders
CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- DONE! You should see "Success. No rows returned."
-- ============================================================
