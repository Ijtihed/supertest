-- Add live session support to games
-- Run this in your Supabase SQL editor

alter table public.games
  add column if not exists live_session_url text,
  add column if not exists is_live boolean not null default false;
