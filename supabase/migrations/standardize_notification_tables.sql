-- This migration standardizes the notification tables to use notification_subscriptions throughout
-- It handles both scenarios: 
-- 1. If push_devices exists as the base table (current likely scenario)
-- 2. If notification_subscriptions needs to be created directly

-- First, check if the push_devices table exists
DO $$
BEGIN
    -- If push_devices already exists, create/update the view 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'push_devices') THEN
        -- Ensure push_devices has last_active column (not last_used)
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'push_devices' 
                      AND column_name = 'last_active') THEN
            -- Add last_active if missing
            ALTER TABLE push_devices 
            ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT timezone('utc'::text, now());
            
            -- If there's a last_used column, copy data from it
            IF EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'push_devices' 
                      AND column_name = 'last_used') THEN
                UPDATE push_devices SET last_active = last_used;
            END IF;
        END IF;
        
        -- Drop and recreate the view
        DROP VIEW IF EXISTS notification_subscriptions;
        CREATE OR REPLACE VIEW notification_subscriptions AS
        SELECT * FROM push_devices;

        -- Grant the same permissions to the view as the table
        GRANT SELECT ON notification_subscriptions TO public;
        GRANT INSERT ON notification_subscriptions TO public;
        GRANT UPDATE ON notification_subscriptions TO public;
        GRANT DELETE ON notification_subscriptions TO public;
        GRANT ALL ON notification_subscriptions TO service_role;
        
        RAISE NOTICE 'Using push_devices as base table with notification_subscriptions view';
    ELSE
        -- If push_devices does not exist, create notification_subscriptions as a real table
        CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          endpoint text UNIQUE NOT NULL,
          p256dh text NOT NULL,
          auth text NOT NULL,
          user_agent text NOT NULL,
          last_active timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Enable Row Level Security
        ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;

        -- Create the necessary policies
        DROP POLICY IF EXISTS "Allow public insert" ON notification_subscriptions;
        CREATE POLICY "Allow public insert" ON notification_subscriptions
          FOR INSERT WITH CHECK (true);
          
        DROP POLICY IF EXISTS "Allow public read" ON notification_subscriptions;
        CREATE POLICY "Allow public read" ON notification_subscriptions
          FOR SELECT USING (true);
          
        DROP POLICY IF EXISTS "Allow public update" ON notification_subscriptions;
        CREATE POLICY "Allow public update" ON notification_subscriptions
          FOR UPDATE USING (true) WITH CHECK (true);
          
        DROP POLICY IF EXISTS "Allow public delete" ON notification_subscriptions;
        CREATE POLICY "Allow public delete" ON notification_subscriptions
          FOR DELETE USING (true);

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS notification_subscriptions_endpoint_idx 
          ON notification_subscriptions(endpoint);
          
        CREATE INDEX IF NOT EXISTS notification_subscriptions_last_active_idx 
          ON notification_subscriptions(last_active);
          
        RAISE NOTICE 'Created notification_subscriptions as real table';
    END IF;
END $$;