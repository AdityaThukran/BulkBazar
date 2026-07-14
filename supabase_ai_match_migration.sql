-- ============================================================
-- BulkBazar AI Match Sourcing Categories Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Add sourcing_categories column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sourcing_categories text;
