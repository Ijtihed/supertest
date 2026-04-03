-- Add cohort column to profiles
-- Run this in your Supabase SQL editor

alter table public.profiles
  add column if not exists cohort text
  check (cohort in ('helsinki', 'san_francisco', 'tokyo'));
