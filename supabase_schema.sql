-- SQL script to set up your waitlist database table and security policies

-- 1. Create the waitlist table
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  company text,
  role text not null default 'seller',
  phone text,
  message text
);

-- 2. Enable Row Level Security (RLS) to secure your database
alter table waitlist enable row level security;

-- 3. Create a policy allowing anyone to submit waitlist registrations
create policy "Allow public inserts" on waitlist
  for insert
  with check (true);
