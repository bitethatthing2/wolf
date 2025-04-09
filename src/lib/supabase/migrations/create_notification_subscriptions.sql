-- Create notification_subscriptions table
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_endpoint ON notification_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_last_active ON notification_subscriptions(last_active);

-- Enable Row Level Security
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- This allows anonymous users to insert, select, update, and delete their own subscriptions
-- In a production app, you might want to restrict this to authenticated users only
CREATE POLICY "Allow public insert" ON notification_subscriptions
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select" ON notification_subscriptions
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public update" ON notification_subscriptions
  FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete" ON notification_subscriptions
  FOR DELETE TO public
  USING (true);

-- Create a function to automatically update last_active timestamp
CREATE OR REPLACE FUNCTION update_notification_subscription_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER update_notification_subscription_last_active
BEFORE UPDATE ON notification_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_notification_subscription_last_active();

-- Add a comment to the table
COMMENT ON TABLE notification_subscriptions IS 'Stores push notification subscriptions for web and mobile clients';
