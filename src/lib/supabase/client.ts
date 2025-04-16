// src/lib/supabase/client.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    // Return existing instance if already created (singleton pattern)
    if (supabaseInstance) {
        return supabaseInstance;
    }

    // Get Supabase credentials from environment variables
    // Use NEXT_PUBLIC_ prefix for variables needed client-side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
        // Throw an error if called without necessary env vars
        // This check happens when getSupabaseClient is called, not on module import
        throw new Error("Supabase URL or Anon Key is missing in environment variables. Cannot create Supabase client.");
    }

    // Try to create the Supabase client instance
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true, // Recommended for client-side
                autoRefreshToken: true,
                // detectSessionInUrl: false, // Set based on your auth flow needs
            },
            // global: { // Global headers usually not needed for standard client usage
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // },
        });

        console.log("Supabase client initialized successfully via getSupabaseClient().");
        return supabaseInstance;

    } catch (error) {
        console.error("Supabase client initialization error:", error);
        // Re-throw or handle the error appropriately
        throw new Error("Failed to initialize Supabase client.");
    }
}

/**
 * Test Supabase connection and notification_subscriptions table setup
 * Usage: await testSupabaseConnection();
 */
export async function testSupabaseConnection(): Promise<boolean> {
    try {
        const supabase = getSupabaseClient();
        console.log("Testing Supabase connection...");
        const { data: tableInfo, error: tableError } = await supabase
            .from('notification_subscriptions')
            .select('*')
            .limit(1);
        if (tableError) {
            console.error('Table check error:', tableError);
            if (tableError.code === '42P01') {
                console.error('Table does not exist. Please run the SQL migration first.');
                return false;
            }
            return false;
        }
        // Test insert
        const uniqueEndpoint = `test-endpoint-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const { error: insertError } = await supabase
            .from('notification_subscriptions')
            .insert({
                device_token: uniqueEndpoint,
                device_info: { user_agent: 'test-user-agent' },
            });
        if (insertError) {
            console.error('Test insert error:', insertError);
            return false;
        }
        console.log('Supabase connection and table verified.');
        return true;
    } catch (err) {
        console.error('Supabase connection test failed:', err);
        return false;
    }
}

// Note: We no longer export the potentially null 'supabase' variable directly.
// Consumers should import and call getSupabaseClient().