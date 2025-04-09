-- Update RLS policies for notification_subscriptions table

-- Create policy to allow anyone to update
create policy "Allow public update" on public.notification_subscriptions
  for update using (true) with check (true);

-- Create policy to allow anyone to delete
create policy "Allow public delete" on public.notification_subscriptions
  for delete using (true);

-- This ensures that all operations (insert, select, update, delete) are allowed
-- which is necessary for the upsert operation to work properly 