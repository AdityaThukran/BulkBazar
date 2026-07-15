-- ============================================================
-- BulkBazar Migration: Add Expiry Date to Products Table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/uqdlpcxhgavvrufkrvxy/sql/new
-- ============================================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS expiry_date DATE;
