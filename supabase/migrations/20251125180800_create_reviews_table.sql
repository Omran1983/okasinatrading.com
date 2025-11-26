-- Create Reviews Table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policy: Anyone can read reviews
create policy "Reviews are public"
  on public.reviews for select
  using ( true );

-- Policy: Anyone can insert reviews (for now, to encourage usage)
create policy "Anyone can leave a review"
  on public.reviews for insert
  with check ( true );
