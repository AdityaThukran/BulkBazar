-- ============================================================
-- BulkBazar Live Real-Time Chat Migration
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- 1. Create messages table linked to order
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Read messages policy: Users can read messages only for orders they participate in
CREATE POLICY "Users can read messages for their own orders"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = messages.order_id
      AND (orders.seller_id = auth.uid() OR orders.buyer_id = auth.uid())
    )
  );

-- 3. Insert messages policy: Users can write messages only for orders they participate in and sender_id must match their auth ID
CREATE POLICY "Users can insert messages to their own orders"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = messages.order_id
      AND (orders.seller_id = auth.uid() OR orders.buyer_id = auth.uid())
    )
  );

-- 4. Enable Realtime updates for messages table
-- This allows React clients to listen to new inserts live
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
