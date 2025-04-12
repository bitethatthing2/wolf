-- This function helps verify the notification table structure
-- It returns information about how notification data is stored in the database

CREATE OR REPLACE FUNCTION check_notification_table_structure()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  result = jsonb_build_object(
    'check_time', now(),
    'tables', jsonb_build_object()
  );
  
  -- Check if notification_subscriptions exists as a table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notification_subscriptions') THEN
    result = jsonb_set(result, '{tables, notification_subscriptions}', jsonb_build_object(
      'type', 'table',
      'columns', (
        SELECT jsonb_agg(jsonb_build_object('name', column_name, 'type', data_type))
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'notification_subscriptions'
      )
    ));
  END IF;
  
  -- Check if notification_subscriptions exists as a view
  IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'notification_subscriptions') THEN
    result = jsonb_set(result, '{tables, notification_subscriptions}', jsonb_build_object(
      'type', 'view',
      'definition', (
        SELECT pg_get_viewdef('notification_subscriptions'::regclass)
      ),
      'columns', (
        SELECT jsonb_agg(jsonb_build_object('name', column_name, 'type', data_type))
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'notification_subscriptions'
      )
    ));
  END IF;
  
  -- Check if push_devices exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'push_devices') THEN
    result = jsonb_set(result, '{tables, push_devices}', jsonb_build_object(
      'type', 'table',
      'columns', (
        SELECT jsonb_agg(jsonb_build_object('name', column_name, 'type', data_type))
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'push_devices'
      )
    ));
  END IF;
  
  -- Check if push_subscriptions exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'push_subscriptions') THEN
    result = jsonb_set(result, '{tables, push_subscriptions}', jsonb_build_object(
      'type', 'table',
      'columns', (
        SELECT jsonb_agg(jsonb_build_object('name', column_name, 'type', data_type))
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'push_subscriptions'
      )
    ));
  END IF;
  
  -- Add policies information
  result = jsonb_set(result, '{policies}', (
    SELECT jsonb_agg(jsonb_build_object(
      'table', tablename,
      'name', policyname,
      'roles', cmd,
      'using', permissive
    ))
    FROM pg_policies 
    WHERE tablename IN ('notification_subscriptions', 'push_devices', 'push_subscriptions')
  ));
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_notification_table_structure() TO authenticated;
GRANT EXECUTE ON FUNCTION check_notification_table_structure() TO service_role;