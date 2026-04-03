-- Admin approval system + review points
-- Run this in your Supabase SQL editor

-- Add status, is_admin, supercell_email, and review_points to profiles
alter table public.profiles
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  add column if not exists is_admin boolean not null default false,
  add column if not exists supercell_email text,
  add column if not exists review_points int not null default 0;

-- To make yourself admin, run this with your own user ID from Supabase > Authentication > Users:
-- UPDATE public.profiles SET status = 'approved', is_admin = true WHERE id = 'YOUR_USER_ID_HERE';
