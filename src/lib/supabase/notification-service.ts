"use client";

import { fetchToken } from '@/lib/firebase/client';

// Define the subscription type
export interface NotificationSubscription {
  id?: string;
  created_at?: string;
  device_token: string;
  device_info: {
    user_agent: string;
    platform: string;
    p256dh?: string;
    auth?: string;
    web_push?: boolean;
    fcm?: boolean;
    test?: boolean;
  };
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
      .select('id, device_token, device_info, created_at, last_active')
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
        device_token: uniqueEndpoint,
        device_info: {
          user_agent: 'test-user-agent',
          platform: 'test-platform',
          test: true
        }
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
      .eq('device_token', uniqueEndpoint);

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
      device_token: token, // Use the FCM token as the device_token
      device_info: {
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        fcm: true
      },
      last_active: new Date().toISOString()
    };

    // Check if this token already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('device_token', token)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
      console.error('Error checking for existing subscription:', checkError);
      return null;
    }

    if (existingSubscription) {
      // Update the last_active timestamp and device info
      const { data: updatedSubscription, error: updateError } = await supabase
        .from('notification_subscriptions')
        .update({ 
          last_active: new Date().toISOString(),
          device_info: {
            user_agent: navigator.userAgent,
            platform: navigator.platform,
            fcm: true,
            updated_at: new Date().toISOString()
          }
        })
        .eq('device_token', token)
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
      device_token: pushSubscription.endpoint,
      device_info: {
        user_agent: userAgent,
        platform: navigator.platform,
        p256dh: btoa(String.fromCharCode.apply(null, 
          new Uint8Array(pushSubscription.getKey('p256dh') as ArrayBuffer) as unknown as number[]
        )),
        auth: btoa(String.fromCharCode.apply(null, 
          new Uint8Array(pushSubscription.getKey('auth') as ArrayBuffer) as unknown as number[]
        )),
        web_push: true
      },
      last_active: new Date().toISOString()
    };

    console.log("Subscription data prepared:", {
      device_token: subscriptionData.device_token,
      user_agent: subscriptionData.device_info.user_agent,
      last_active: subscriptionData.last_active
    });

    console.log("Attempting to save to Supabase...");
    
    // First check if the record already exists
    const { data: existingData, error: checkError } = await supabase
      .from('notification_subscriptions')
      .select('id')
      .eq('device_token', subscriptionData.device_token)
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
          device_info: subscriptionData.device_info,
          last_active: subscriptionData.last_active
        })
        .eq('device_token', subscriptionData.device_token)
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
              device_info: subscriptionData.device_info,
              last_active: subscriptionData.last_active
            })
            .eq('device_token', subscriptionData.device_token)
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
    console.log('Fetching FCM token with service worker registration...');
    const token = await fetchToken(swRegistration);
    if (!token) {
      console.error('Failed to get FCM token');
      return null;
    }
    
    // Show a welcome notification for new registrations
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        console.log('Showing welcome notification...');
        
        // Get user agent info to customize welcome message
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isAndroid = /Android/.test(userAgent);
        
        // Custom welcome message based on platform
        let welcomeMessage = 'You\'ll now receive updates about our latest events and specials.';
        if (isIOS) {
          welcomeMessage = 'Thanks for enabling notifications on your iOS device!';
        } else if (isAndroid) {
          welcomeMessage = 'Thanks for joining the Side Hustle pack! You\'ll get updates on events and specials.';
        }
        
        // Show welcome notification with appropriate icon
        const iconPath = isAndroid 
          ? '/only_these/android/notification-icon-android.png'
          : '/only_these/ios/notification-icon-ios.png';
          
        setTimeout(() => {
          new Notification('Welcome to Side Hustle Bar!', {
            body: welcomeMessage,
            icon: iconPath,
            badge: '/only_these/notification-badge.png',
            tag: 'welcome-notification',
            silent: isIOS
          });
        }, 1500);
      } catch (error) {
        console.error('Error showing welcome notification:', error);
      }
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
      .eq('device_token', token);

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
 * @param platform Optional platform filter ('ios', 'android', 'web')
 * @param maxAge Optional maximum age in days for active subscriptions
 * @returns Array of active subscriptions or empty array if there was an error
 */
export async function getActiveSubscriptions(
  supabase: any, 
  platform?: 'ios' | 'android' | 'web' | 'all',
  maxAge?: number
): Promise<NotificationSubscription[]> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return [];
    }

    console.log("Fetching active subscriptions...");
    let query = supabase
      .from('notification_subscriptions')
      .select('*')
    
    // Filter by platform if specified
    if (platform && platform !== 'all') {
      if (platform === 'ios') {
        query = query.ilike('device_info->>user_agent', '%iphone%').or('device_info->>user_agent.ilike=%ipad%');
      } else if (platform === 'android') {
        query = query.ilike('device_info->>user_agent', '%android%');
      } else if (platform === 'web') {
        query = query.not.ilike('device_info->>user_agent', '%android%')
                    .not.ilike('device_info->>user_agent', '%iphone%')
                    .not.ilike('device_info->>user_agent', '%ipad%');
      }
    }
    
    // Filter by age if specified
    if (maxAge && maxAge > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAge);
      query = query.gte('last_active', cutoffDate.toISOString());
    }
    
    // Execute query and order by last active
    const { data, error } = await query.order('last_active', { ascending: false });

    if (error) {
      console.error('Error getting subscriptions:', error);
      return [];
    }

    console.log(`Retrieved ${data.length} active subscriptions${platform ? ` for ${platform}` : ''}`);
    return data;
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
}

/**
 * Clean up old notification subscriptions
 * @param supabase The Supabase client
 * @param olderThanDays Remove subscriptions older than this many days
 * @returns Number of deleted subscriptions
 */
export async function cleanupOldSubscriptions(supabase: any, olderThanDays: number = 90): Promise<number> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return 0;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    console.log(`Cleaning up subscriptions older than ${olderThanDays} days (${cutoffDate.toISOString()})`);
    
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .delete()
      .lt('last_active', cutoffDate.toISOString())
      .select('id');
      
    if (error) {
      console.error('Error cleaning up old subscriptions:', error);
      return 0;
    }
    
    const deletedCount = data?.length || 0;
    console.log(`Deleted ${deletedCount} old subscription(s)`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up old subscriptions:', error);
    return 0;
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
