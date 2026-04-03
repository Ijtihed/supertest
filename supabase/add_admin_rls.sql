-- Allow admins to update any profile (approve/reject users)
-- Run this in your Supabase SQL editor

create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
