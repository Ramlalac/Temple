alter table if exists public.events
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists section text,
  add column if not exists category text,
  add column if not exists created_at timestamp with time zone default now();

alter table if exists public.gallery
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists section text,
  add column if not exists category text,
  add column if not exists created_at timestamp with time zone default now();

alter table if exists public.activities
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists section text,
  add column if not exists category text,
  add column if not exists created_at timestamp with time zone default now();

alter table if exists public.blogs
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists section text,
  add column if not exists category text,
  add column if not exists created_at timestamp with time zone default now();

create table if not exists public.donation_temples (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  image_url text,
  section text default 'donations page',
  category text default '',
  created_at timestamp with time zone default now()
);

alter table if exists public.events enable row level security;
alter table if exists public.gallery enable row level security;
alter table if exists public.activities enable row level security;
alter table if exists public.blogs enable row level security;
alter table if exists public.donation_temples enable row level security;

drop policy if exists "events_select_all" on public.events;
create policy "events_select_all" on public.events for select using (true);
drop policy if exists "events_insert_all" on public.events;
create policy "events_insert_all" on public.events for insert with check (true);
drop policy if exists "events_update_all" on public.events;
create policy "events_update_all" on public.events for update using (true) with check (true);
drop policy if exists "events_delete_all" on public.events;
create policy "events_delete_all" on public.events for delete using (true);

drop policy if exists "gallery_select_all" on public.gallery;
create policy "gallery_select_all" on public.gallery for select using (true);
drop policy if exists "gallery_insert_all" on public.gallery;
create policy "gallery_insert_all" on public.gallery for insert with check (true);
drop policy if exists "gallery_update_all" on public.gallery;
create policy "gallery_update_all" on public.gallery for update using (true) with check (true);
drop policy if exists "gallery_delete_all" on public.gallery;
create policy "gallery_delete_all" on public.gallery for delete using (true);

drop policy if exists "activities_select_all" on public.activities;
create policy "activities_select_all" on public.activities for select using (true);
drop policy if exists "activities_insert_all" on public.activities;
create policy "activities_insert_all" on public.activities for insert with check (true);
drop policy if exists "activities_update_all" on public.activities;
create policy "activities_update_all" on public.activities for update using (true) with check (true);
drop policy if exists "activities_delete_all" on public.activities;
create policy "activities_delete_all" on public.activities for delete using (true);

drop policy if exists "blogs_select_all" on public.blogs;
create policy "blogs_select_all" on public.blogs for select using (true);
drop policy if exists "blogs_insert_all" on public.blogs;
create policy "blogs_insert_all" on public.blogs for insert with check (true);
drop policy if exists "blogs_update_all" on public.blogs;
create policy "blogs_update_all" on public.blogs for update using (true) with check (true);
drop policy if exists "blogs_delete_all" on public.blogs;
create policy "blogs_delete_all" on public.blogs for delete using (true);

drop policy if exists "donation_temples_select_all" on public.donation_temples;
create policy "donation_temples_select_all" on public.donation_temples for select using (true);
drop policy if exists "donation_temples_insert_all" on public.donation_temples;
create policy "donation_temples_insert_all" on public.donation_temples for insert with check (true);
drop policy if exists "donation_temples_update_all" on public.donation_temples;
create policy "donation_temples_update_all" on public.donation_temples for update using (true) with check (true);
drop policy if exists "donation_temples_delete_all" on public.donation_temples;
create policy "donation_temples_delete_all" on public.donation_temples for delete using (true);
