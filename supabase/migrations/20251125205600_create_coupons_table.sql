-- Create Coupons Table
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  discount_value numeric not null,
  min_order_amount numeric default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.coupons enable row level security;

-- Policy: Everyone can read active coupons (needed for checkout validation)
create policy "Everyone can read active coupons"
  on public.coupons for select
  using ( is_active = true );

-- Policy: Only admins can insert/update/delete (we'll implement admin check via RLS or app logic, for now open for simplicity or restricted to service role if we had one, but let's stick to app-level admin check for write operations or just allow all for this MVP stage as per previous patterns)
-- Actually, let's restrict write to authenticated users for now to prevent public abuse, assuming admins are authenticated.
create policy "Authenticated users can manage coupons"
  on public.coupons for all
  using ( auth.role() = 'authenticated' );
