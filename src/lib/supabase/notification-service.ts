"use client";

import { fetchToken } from '@/lib/firebase/client';

// Define the subscription type
export interface NotificationSubscription {
  id?: string;
  created_at?: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string;
  last_active?: string;
}

/**
 * Test the Supabase connection and notification table setup
 * @returns true if successful, false otherwise
 */
export async function testNotificationSetup(supabase: any): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }
    
    console.log("Testing Supabase connection...");
    
    // First, try to get the table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Table check error:', tableError);
      
      // If it's a table not found error, the table might not exist
      if (tableError.code === '42P01') {
        console.error('Table does not exist. Please run the SQL migration first.');
        return false;
      }
      return false;
    }

    // Generate a unique endpoint for testing
    const uniqueEndpoint = `test-endpoint-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Test inserting a record
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .insert({
        endpoint: uniqueEndpoint,
        p256dh: 'test-p256dh',
        auth: 'test-auth',
        user_agent: 'test-user-agent'
      })
      .select();

    if (error) {
      console.error('Supabase connection error:', error.message);
      
      // If it's a duplicate key error, it's not a critical error for our test
      if (error.message.includes('duplicate key value') || error.code === '23505') {
        console.log('Duplicate key error - this is not critical for testing connection');
        return true;
      }
      
      return false;
    }

    console.log("Test record inserted successfully:", data);

    // Clean up test record
    const { error: deleteError } = await supabase
      .from('notification_subscriptions')
      .delete()
      .eq('endpoint', uniqueEndpoint);

    if (deleteError) {
      console.error('Error deleting test record:', deleteError);
    } else {
      console.log("Test record deleted successfully");
    }

    console.log('Supabase connection and table setup successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

/**
 * Save a new FCM token to Supabase
 * @param token The FCM token to save
 * @param supabase The Supabase client
 * @returns The saved subscription or null if there was an error
 */
export async function saveNotificationSubscription(token: string, supabase: any): Promise<NotificationSubscription | null> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }

    if (!token) {
      console.error('No token provided to saveNotificationSubscription');
      return null;
    }

    // For FCM tokens, we need to create a subscription-like object
    const subscription = {
      endpoint: token, // Use the FCM token as the endpoint
      p256dh: 'fcm', // For FCM, we don't need these values but the table requires them
      auth: 'fcm',
      user_agent: navigator.userAgent,
      last_active: new Date().toISOString()
    };

    // Check if this token already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('endpoint', token)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
      console.error('Error checking for existing subscription:', checkError);
      return null;
    }

    if (existingSubscription) {
      // Update the last_active timestamp
      const { data: updatedSubscription, error: updateError } = await supabase
        .from('notification_subscriptions')
        .update({ 
          last_active: new Date().toISOString(),
          user_agent: navigator.userAgent // Update user agent in case it changed
        })
        .eq('endpoint', token)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return null;
      }

      console.log('Updated existing notification subscription');
      return updatedSubscription;
    } else {
      // Insert a new subscription
      const { data: newSubscription, error: insertError } = await supabase
        .from('notification_subscriptions')
        .insert(subscription)
        .select()
        .single();

      if (insertError) {
        console.error('Error saving subscription:', insertError);
        return null;
      }

      console.log('Saved new notification subscription');
      return newSubscription;
    }
  } catch (error) {
    console.error('Error in saveNotificationSubscription:', error);
    return null;
  }
}

/**
 * Save a web push subscription to Supabase
 * @param pushSubscription The web push subscription object
 * @param userAgent The user agent string
 * @param supabase The Supabase client
 * @returns The saved subscription or null if there was an error
 */
export async function saveWebPushSubscription(
  pushSubscription: PushSubscription,
  userAgent: string = navigator.userAgent,
  supabase: any
): Promise<NotificationSubscription | null> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }

    if (!pushSubscription || !pushSubscription.endpoint) {
      console.error('Invalid push subscription');
      return null;
    }

    console.log("Preparing subscription data...");
    const subscriptionData = {
      endpoint: pushSubscription.endpoint,
      p256dh: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(pushSubscription.getKey('p256dh') as ArrayBuffer) as unknown as number[]
      )),
      auth: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(pushSubscription.getKey('auth') as ArrayBuffer) as unknown as number[]
      )),
      user_agent: userAgent,
      last_active: new Date().toISOString()
    };

    console.log("Subscription data prepared:", {
      endpoint: subscriptionData.endpoint,
      user_agent: subscriptionData.user_agent,
      last_active: subscriptionData.last_active
    });

    console.log("Attempting to save to Supabase...");
    
    // First check if the record already exists
    const { data: existingData, error: checkError } = await supabase
      .from('notification_subscriptions')
      .select('id')
      .eq('endpoint', subscriptionData.endpoint)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      return null;
    }
    
    // If record exists, update it
    if (existingData) {
      console.log("Subscription already exists, updating...");
      const { data: updateData, error: updateError } = await supabase
        .from('notification_subscriptions')
        .update({
          p256dh: subscriptionData.p256dh,
          auth: subscriptionData.auth,
          user_agent: subscriptionData.user_agent,
          last_active: subscriptionData.last_active
        })
        .eq('endpoint', subscriptionData.endpoint)
        .select();
      
      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return null;
      }
      
      console.log("Subscription updated successfully");
      return updateData && updateData.length > 0 ? updateData[0] : { id: existingData.id, ...subscriptionData };
    } else {
      // If record doesn't exist, insert it
      console.log("Subscription doesn't exist, inserting...");
      const { data: insertData, error: insertError } = await supabase
        .from('notification_subscriptions')
        .insert(subscriptionData)
        .select();
      
      if (insertError) {
        console.error('Error inserting subscription:', insertError);
        
        // If it's a duplicate key error, try updating instead
        if (insertError.message.includes('duplicate key value') || insertError.code === '23505') {
          console.log("Duplicate key detected, updating existing record...");
          
          const { data: updateData, error: updateError } = await supabase
            .from('notification_subscriptions')
            .update({
              p256dh: subscriptionData.p256dh,
              auth: subscriptionData.auth,
              user_agent: subscriptionData.user_agent,
              last_active: subscriptionData.last_active
            })
            .eq('endpoint', subscriptionData.endpoint)
            .select();
          
          if (updateError) {
            console.error('Error updating subscription after duplicate key:', updateError);
            return null;
          }
          
          console.log("Subscription updated successfully after duplicate key");
          return updateData && updateData.length > 0 ? updateData[0] : null;
        }
        
        return null;
      }
      
      console.log("Subscription inserted successfully");
      return insertData && insertData.length > 0 ? insertData[0] : null;
    }
  } catch (error) {
    console.error('Error saving web push subscription:', error);
    return null;
  }
}

/**
 * Register for push notifications
 * @param swRegistration The service worker registration
 * @param supabase The Supabase client
 * @returns The FCM token if successful, null otherwise
 */
export async function registerForPushNotifications(swRegistration: ServiceWorkerRegistration | null, supabase: any): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    // Request permission
    let permission = Notification.permission;
    if (permission !== 'granted') {
      console.log('Requesting notification permission');
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get FCM token
    const token = await fetchToken(swRegistration);
    if (!token) {
      console.error('Failed to get FCM token');
      return null;
    }

    // Save subscription to Supabase
    const subscription = await saveNotificationSubscription(token, supabase);
    if (!subscription) {
      console.error('Failed to save subscription to Supabase');
      // Still return the token as we got it successfully
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

/**
 * Unregister from push notifications
 * @param token The FCM token to unregister
 * @param supabase The Supabase client
 * @returns true if successful, false otherwise
 */
export async function unregisterFromPushNotifications(token: string, supabase: any): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    if (!token) {
      console.error('No token provided to unregisterFromPushNotifications');
      return false;
    }

    // Delete the subscription from Supabase
    const { error } = await supabase
      .from('notification_subscriptions')
      .delete()
      .eq('endpoint', token);

    if (error) {
      console.error('Error deleting subscription:', error);
      return false;
    }

    console.log('Unregistered from push notifications');
    return true;
  } catch (error) {
    console.error('Error in unregisterFromPushNotifications:', error);
    return false;
  }
}

/**
 * Get all active notification subscriptions
 * @param supabase The Supabase client
 * @returns Array of active subscriptions or empty array if there was an error
 */
export async function getActiveSubscriptions(supabase: any): Promise<NotificationSubscription[]> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return [];
    }

    console.log("Fetching active subscriptions...");
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .order('last_active', { ascending: false });

    if (error) {
      console.error('Error getting subscriptions:', error);
      return [];
    }

    console.log("Active subscriptions retrieved:", data);
    return data;
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
}

export default {
  saveNotificationSubscription,
  saveWebPushSubscription,
  registerForPushNotifications,
  unregisterFromPushNotifications,
  testNotificationSetup,
  getActiveSubscriptions
};
