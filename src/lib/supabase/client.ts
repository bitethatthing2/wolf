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

// Note: We no longer export the potentially null 'supabase' variable directly.
// Consumers should import and call getSupabaseClient().