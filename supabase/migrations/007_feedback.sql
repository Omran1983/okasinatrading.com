-- supabase/migrations/007_feedback.sql
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamp default now()
);
