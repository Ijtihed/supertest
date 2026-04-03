-- Add collaborators support to games
-- Run this in your Supabase SQL editor

alter table public.games
  add column if not exists collaborator_ids uuid[] not null default '{}';
