-- Supertest Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles table (auto-created on sign-up via trigger)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Anonymous'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Games table
create table public.games (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null default '',
  cover_image_url text,
  game_type text not null check (game_type in ('file', 'link', 'web')),
  game_url text,
  file_path text,
  platforms text[] default '{}',
  genres text[] default '{}',
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  invite_code text unique default encode(gen_random_bytes(6), 'hex'),
  status text not null default 'active' check (status in ('active', 'paused')),
  created_at timestamptz default now() not null
);

alter table public.games enable row level security;

create policy "Public games are viewable by everyone"
  on public.games for select
  using (visibility = 'public' or owner_id = auth.uid());

create policy "Users can create games"
  on public.games for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own games"
  on public.games for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own games"
  on public.games for delete
  using (auth.uid() = owner_id);

-- Feedback questions (custom per game)
create table public.feedback_questions (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  question_text text not null,
  question_type text not null check (question_type in ('text', 'rating', 'multiple_choice', 'yes_no')),
  options jsonb,
  sort_order int not null default 0
);

alter table public.feedback_questions enable row level security;

create policy "Questions are viewable by everyone"
  on public.feedback_questions for select using (true);

create policy "Game owners can manage questions"
  on public.feedback_questions for insert
  with check (
    auth.uid() = (select owner_id from public.games where id = game_id)
  );

create policy "Game owners can update questions"
  on public.feedback_questions for update
  using (
    auth.uid() = (select owner_id from public.games where id = game_id)
  );

create policy "Game owners can delete questions"
  on public.feedback_questions for delete
  using (
    auth.uid() = (select owner_id from public.games where id = game_id)
  );

-- Feedback responses
create table public.feedback_responses (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  overall_rating int not null check (overall_rating between 1 and 5),
  gameplay_rating int check (gameplay_rating between 1 and 5),
  gameplay_comment text,
  visuals_rating int check (visuals_rating between 1 and 5),
  visuals_comment text,
  fun_factor_rating int check (fun_factor_rating between 1 and 5),
  fun_factor_comment text,
  bugs_encountered text,
  would_play_again text not null check (would_play_again in ('yes', 'maybe', 'no')),
  free_text text,
  video_links text[] default '{}',
  custom_answers jsonb default '{}',
  created_at timestamptz default now() not null,

  unique(game_id, reviewer_id)
);

alter table public.feedback_responses enable row level security;

create policy "Game owners can view all feedback for their games"
  on public.feedback_responses for select
  using (
    auth.uid() = reviewer_id
    or auth.uid() = (select owner_id from public.games where id = game_id)
  );

create policy "Authenticated users can submit feedback"
  on public.feedback_responses for insert
  with check (auth.uid() = reviewer_id);

create policy "Users can update their own feedback"
  on public.feedback_responses for update
  using (auth.uid() = reviewer_id);

-- Storage bucket for game files and cover images
insert into storage.buckets (id, name, public)
values ('game-assets', 'game-assets', true)
on conflict (id) do nothing;

create policy "Anyone can view game assets"
  on storage.objects for select
  using (bucket_id = 'game-assets');

create policy "Authenticated users can upload game assets"
  on storage.objects for insert
  with check (bucket_id = 'game-assets' and auth.role() = 'authenticated');

create policy "Users can update their own assets"
  on storage.objects for update
  using (bucket_id = 'game-assets' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own assets"
  on storage.objects for delete
  using (bucket_id = 'game-assets' and auth.uid()::text = (storage.foldername(name))[1]);
