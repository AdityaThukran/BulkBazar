-- ============================================================
-- BulkBazar Unread Message Notification Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Add read column to messages if it doesn't exist
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read boolean DEFAULT false NOT NULL;
