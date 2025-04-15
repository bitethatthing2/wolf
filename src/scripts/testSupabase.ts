import 'dotenv/config';
import { getSupabaseClient } from '../lib/supabase/client';
import { testNotificationSetup } from '../lib/supabase/notification-service';

(async () => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.');
      process.exit(1);
    }
    console.log('Testing Supabase connection and notification table setup...');
    const result = await testNotificationSetup(supabase);
    if (result) {
      console.log('✅ Supabase connection and notification system are properly configured!');
      process.exit(0);
    } else {
      console.error('❌ Supabase test failed. See logs above for details.');
      process.exit(2);
    }
  } catch (error) {
    // Enhanced error logging for network issues
    if (error instanceof Error) {
      console.error('Error running Supabase test:', error.message);
      if (error.stack) console.error(error.stack);
      if ('cause' in error) console.error('Cause:', (error as any).cause);
    } else {
      console.error('Unknown error running Supabase test:', error);
    }
    // Try to print environment for debugging
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '[set]' : '[not set]');
    process.exit(3);
  }
})();
