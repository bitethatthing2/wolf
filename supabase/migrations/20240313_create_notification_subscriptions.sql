-- Create the notification_subscriptions table
create table if not exists public.notification_subscriptions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  user_agent text not null,
  last_active timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.notification_subscriptions enable row level security;

-- Create policy to allow anyone to insert
create policy "Allow public insert" on public.notification_subscriptions
  for insert with check (true);

-- Create policy to allow anyone to read
create policy "Allow public read" on public.notification_subscriptions
  for select using (true);

-- Create index on endpoint for faster lookups
create index if not exists notification_subscriptions_endpoint_idx 
  on public.notification_subscriptions(endpoint);

-- Create index on last_active for faster sorting
create index if not exists notification_subscriptions_last_active_idx 
  on public.notification_subscriptions(last_active); 