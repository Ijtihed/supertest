-- Allow admins to delete any game
-- Run this in your Supabase SQL editor

create policy "Admins can delete any game"
  on public.games for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
