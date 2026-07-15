-- Allow buyers to update their own orders (needed for accepting or declining pitches)
DROP POLICY IF EXISTS "Buyers can update own orders" ON orders;
CREATE POLICY "Buyers can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = buyer_id);
