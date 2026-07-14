-- ============================================================
-- BulkBazar Full Database Schema
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Stores user profile info, linked to Supabase Auth
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  full_name text not null,
  company text,
  role text not null default 'seller',
  phone text,
  avatar_url text
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- 2. PRODUCTS TABLE
-- Vendor inventory items
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  category text not null default 'Other',
  quantity integer not null default 0,
  unit text not null default 'pieces',
  price decimal(12,2) not null default 0,
  mrp decimal(12,2),
  condition text not null default 'new',
  status text not null default 'active',
  image_url text
);

alter table products enable row level security;

create policy "Users can read own products"
  on products for select
  using (auth.uid() = user_id);

create policy "Users can insert own products"
  on products for insert
  with check (auth.uid() = user_id);

create policy "Users can update own products"
  on products for update
  using (auth.uid() = user_id);

create policy "Users can delete own products"
  on products for delete
  using (auth.uid() = user_id);

-- 3. ORDERS TABLE
-- Track buy/sell orders between users
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  product_id uuid references products(id) on delete set null,
  seller_id uuid references profiles(id) on delete set null not null,
  buyer_name text not null,
  buyer_email text not null,
  quantity integer not null default 1,
  total_price decimal(12,2) not null default 0,
  status text not null default 'pending',
  notes text
);

alter table orders enable row level security;

create policy "Users can read own orders"
  on orders for select
  using (auth.uid() = seller_id);

create policy "Users can insert orders"
  on orders for insert
  with check (auth.uid() = seller_id);

create policy "Users can update own orders"
  on orders for update
  using (auth.uid() = seller_id);

-- ============================================================
-- DONE! You should see "Success. No rows returned" message.
-- ============================================================
