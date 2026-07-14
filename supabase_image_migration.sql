-- ============================================================
-- BulkBazar Product Image Upload Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add image_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- 4. Allow public read access to product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- 5. Allow users to delete their own uploaded images
CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
