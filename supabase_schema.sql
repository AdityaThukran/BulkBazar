-- CREATE WAITLIST TABLE
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

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PRIVACY
alter table waitlist enable row level security;

-- ALLOW ANONYMOUS INSERTION OF DATA (FOR THE WAITLIST FORM)
create policy "Allow public inserts" on waitlist
  for insert
  with check (true);

-- ALLOW READ-ONLY ACCESS TO ADMINS/AUTHENTICATED (OPTIONAL)
create policy "Allow read access for authenticated users" on waitlist
  for select
  to authenticated
  using (true);
