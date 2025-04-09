git add package.json package-lock.json
git commit -m "fix: add  dependency"
git push origin main
# Updating Supabase RLS Policies

Since we're having issues with the automated script, you can update the RLS policies manually through the Supabase Dashboard.

## Steps to Update RLS Policies

1. Log in to your Supabase Dashboard at https://app.supabase.com/
2. Select your project
3. Navigate to **Database** > **Tables** in the left sidebar
4. Find the `notification_subscriptions` table
5. Click on the **Policies** tab
6. You should see existing policies for `insert` and `select` operations
7. Click on **New Policy** to add policies for `update` and `delete` operations

## Add Update Policy

1. Select **Update** as the operation
2. Name the policy: `Allow public update`
3. For the USING expression, enter: `true`
4. For the WITH CHECK expression, enter: `true`
5. Click **Save Policy**

## Add Delete Policy

1. Select **Delete** as the operation
2. Name the policy: `Allow public delete`
3. For the USING expression, enter: `true`
4. Click **Save Policy**

## Verify Policies

After adding these policies, you should have a total of 4 policies for the `notification_subscriptions` table:
- Allow public insert
- Allow public select
- Allow public update
- Allow public delete

These policies will allow all operations on the table, which is necessary for the upsert operation to work properly.

## Test the Connection

After updating the policies, you can run the test script to verify the connection:

```bash
cd firebase-cloud-messaging-web-push-notifications-with-nextjs-14-tutorial
node test-supabase.js
```

Make sure to update your `.env` file with the correct Supabase URL and anon key before running the test script. 