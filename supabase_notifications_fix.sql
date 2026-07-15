-- ============================================================
-- BulkBazar Migration: Fix Notifications Table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/uqdlpcxhgavvrufkrvxy/sql/new
-- ============================================================

-- 1. Add dedup_key column to prevent duplicate notifications on reload
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS dedup_key TEXT;

-- 2. Add DELETE policy so users can remove their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
