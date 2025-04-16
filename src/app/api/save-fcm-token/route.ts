import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
// Ensure these environment variables are set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in environment variables.");
  // Optionally throw an error during build/startup if preferred
}

// Create a Supabase client instance, handling potential missing env vars
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function POST(request: NextRequest) {
  console.log("Received request to /api/save-fcm-token");

  if (!supabase) {
    console.error("Supabase client not initialized due to missing environment variables.");
    return NextResponse.json(
      { message: 'Server configuration error: Supabase not initialized.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const token = body.token;

    if (!token || typeof token !== 'string') {
      console.log("Invalid request: Token is missing or not a string.");
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    console.log(`Attempting to save token: ${token.substring(0, 10)}...`);

    // Assumes a table named 'device_tokens' with a 'token' column (TEXT, UNIQUE)
    const { data, error } = await supabase
      .from('device_tokens')
      .insert([{ token: token }])
      .select(); // .select() can be useful for confirming insert or handling conflicts

    if (error) {
      // Check for unique constraint violation (duplicate token)
      if (error.code === '23505') { // PostgreSQL unique violation code
        console.log(`Token already exists: ${token.substring(0, 10)}...`);
        return NextResponse.json({ message: 'Token already registered' }, { status: 200 }); // Or 409 Conflict
      } else {
        console.error('Supabase error saving token:', error);
        return NextResponse.json(
          { message: 'Failed to save token', error: error.message },
          { status: 500 }
        );
      }
    }

    console.log(`Token saved successfully: ${token.substring(0, 10)}...`, data);
    return NextResponse.json({ message: 'Token saved successfully', data }, { status: 201 });

  } catch (error) {
    console.error('Error processing request:', error);
    // Handle JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON format in request body' }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
