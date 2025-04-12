// scripts/test-supabase-connection.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env.local file.');
  process.exit(1);
}

console.log('Connecting to Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
async function testConnection() {
  try {
    // Test simple query
    const { data: tableInfo, error } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.error('Table does not exist. Run migrations first.');
      } else {
        console.error('Error connecting to Supabase:', error);
      }
      return false;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Retrieved data:', tableInfo);
    
    // Check table structure
    const { data: structureInfo, error: structureError } = await supabase
      .rpc('check_notification_table_structure');
      
    if (structureError) {
      console.log('Info: Could not check table structure. This is normal if the helper function is not installed.');
      console.log('Table structure helper function error:', structureError);
    } else {
      console.log('Table structure check:', structureInfo);
    }
    
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
}

testConnection()
  .then(result => {
    if (!result) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });