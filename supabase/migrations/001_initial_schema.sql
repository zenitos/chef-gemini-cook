-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table for additional user data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recipes table to store user's recipe history
create table if not exists public.recipes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  ingredients jsonb not null,
  instructions jsonb not null,
  cooking_time text,
  servings text,
  difficulty text,
  tips jsonb,
  search_query text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create policies for recipes
create policy "Users can view their own recipes" on public.recipes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own recipes" on public.recipes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own recipes" on public.recipes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own recipes" on public.recipes
  for delete using (auth.uid() = user_id);

-- Create function to handle user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create indexes for better performance
create index if not exists recipes_user_id_idx on public.recipes (user_id);
create index if not exists recipes_created_at_idx on public.recipes (created_at desc);