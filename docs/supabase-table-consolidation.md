# Supabase Notification Table Standardization

## Initial Issues

The application had inconsistent table references between:
1. `notification_subscriptions` (primary name used in application code)
2. `push_devices` (appears in some SQL files)
3. `push_subscriptions` (found in cleanup function in notifications API route)

## Solution Implemented

We've standardized all notification table references to use `notification_subscriptions`:

1. Fixed the cleanup function in the notifications API route to use `notification_subscriptions` with the correct column name `last_active` instead of `push_subscriptions` with column `last_used`

2. Added a new migration script (`standardize_notification_tables.sql`) that:
   - Handles both scenarios (whether `push_devices` exists or not)
   - Creates a proper `notification_subscriptions` view if `push_devices` is the actual table
   - Creates a direct `notification_subscriptions` table if needed
   - Ensures all the correct columns exist, particularly `last_active`

3. Added a diagnostic function (`check_notification_table_structure()`) to:
   - Verify the database structure
   - Check which tables/views exist
   - Report on the policies that are applied
   - Help with debugging any remaining issues

## Implementation Details

### Table Structure Compatibility

The standardization ensures that regardless of the underlying table structure, all application code can use `notification_subscriptions` consistently:

```
notification_subscriptions
├── id (UUID, primary key)
├── created_at (timestamp with timezone)  
├── endpoint (text, unique)
├── p256dh (text)
├── auth (text)
├── user_agent (text)
└── last_active (timestamp with timezone)
```

### Migration Scripts

1. **standardize_notification_tables.sql**: Ensures `notification_subscriptions` exists either as a table or view
2. **add_table_structure_check.sql**: Adds a diagnostic function to verify the database structure

### RLS Policies

All necessary Row Level Security (RLS) policies are applied to ensure proper access controls:
- Anyone can insert their own device tokens
- Anyone can read their own device tokens
- Anyone can update their own device tokens
- Anyone can delete their own device tokens
- Service role can read all device tokens

## How to Verify

Run the updated test script to check the connection and table structure:

```
node scripts/test-supabase-connection.js
```

The script will connect to your Supabase instance and report on the notification table structure.