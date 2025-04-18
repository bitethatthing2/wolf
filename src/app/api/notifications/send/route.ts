import { NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getActiveSubscriptions } from "@/lib/supabase/notification-service";
import { createPlatformPayloads } from "@/lib/utils/notification-routing";
import { getSupabaseClient } from "@/lib/supabase/client";

// Helper function to clean up old subscriptions
async function cleanupOldSubscriptions(supabase: any, olderThanDays: number = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const { error } = await supabase
      .from('notification_subscriptions')
      .delete()
      .lt('last_active', cutoffDate.toISOString());
      
    if (error) {
      console.error("Error cleaning up old subscriptions:", error);
    } else {
      console.log(`Successfully cleaned up subscriptions older than ${olderThanDays} days`);
    }
  } catch (err) {
    console.error("Failed to clean up old subscriptions:", err);
  }
}

// Define result types
type NotificationResult = {
  success: boolean;
  sent: number;
  failed: number;
  details: Array<{
    token?: string;
    platform: string;
    status: string;
    error?: string;
  }>;
};

export async function POST(request: Request) {
  // --- Initialize Firebase Admin SDK within the handler ---
  if (!getApps().length) {
    try {
      // Use environment variables from Netlify
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined;

      if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.error("Firebase Admin SDK credentials not available during API call.");
        return NextResponse.json(
          { error: "Server configuration error: Firebase Admin credentials missing." },
          { status: 500 }
        );
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        storageBucket: process.env.STORAGE_BUCKET,
      });
      console.log("Firebase Admin initialized within POST handler using environment variables.");
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
      return NextResponse.json(
        { error: "Server configuration error: Failed to initialize Firebase Admin." },
        { status: 500 }
      );
    }
  }
  // --- End Firebase Admin Initialization ---

  try {
    const { token, title, message, link, platform, sendToAll = false } = await request.json();

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required fields" },
        { status: 400 }
      );
    }

    if (!token && !sendToAll) {
      return NextResponse.json(
        { error: "Either token or sendToAll must be provided" },
        { status: 400 }
      );
    }

    // Handle development mode with test token
    if (token === "test-token-for-ui-development") {
      console.log("Development mode detected, simulating notification send");
      
      // Simulate a successful response for development
      return NextResponse.json({
        success: true,
        sent: 1,
        failed: 0,
        details: [
          { 
            token: "test-token-for-ui-development", 
            platform: platform || "web", 
            status: "success",
            development: true
          }
        ],
        message: "This is a simulated response for development mode. In production, real notifications would be sent."
      });
    }

    // Check if Supabase client is initialized (for sendToAll)
    if (sendToAll) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return NextResponse.json(
          { error: "Supabase client is not initialized. Check environment variables." },
          { status: 500 }
        );
      }
    }

    const messaging = getMessaging();
    const results: NotificationResult = { success: false, sent: 0, failed: 0, details: [] };

    // Base notification payload
    const basePayload = {
      notification: {
        title: title,
        body: message,
      },
      data: {
        link: link || "/",
      },
    };

    // Get platform-specific payloads using our router utility
    const { android: androidPayload, ios: iosPayload, web: webPayload } = 
      createPlatformPayloads(basePayload, token);

    // Send to all registered devices
    if (sendToAll) {
      try {
        // Get all active subscriptions from Supabase with platform filtering
        const supabase = getSupabaseClient();
        // Clean up old subscriptions first (older than 90 days)
        await cleanupOldSubscriptions(supabase, 90);
        
        // Get active subscriptions with platform filtering if specified
        const maxAge = 60; // Only get subscriptions active in the last 60 days
        const subscriptions = await getActiveSubscriptions(supabase, platform as any, maxAge);
        
        if (subscriptions.length === 0) {
          return NextResponse.json(
            { error: `No active subscriptions found${platform ? ` for platform ${platform}` : ''}` },
            { status: 404 }
          );
        }

        console.log(`Sending notifications to ${subscriptions.length} devices${platform ? ` for ${platform}` : ''}`);
        
        // Group tokens by platform for batch sending
        const androidTokens: string[] = [];
        const iosTokens: string[] = [];
        const webTokens: string[] = [];
        const platformMap = new Map<string, string>(); // Map token to platform for reporting
        
        // Categorize tokens by platform
        for (const subscription of subscriptions) {
          const deviceToken = subscription.device_token || subscription.endpoint;
          const userAgent = ((subscription.device_info || {}).user_agent || subscription.user_agent || '').toLowerCase();
          
          // Get device info or fallback to user agent for older records
          const deviceInfo = subscription.device_info || {};
          const userAgentString = (typeof deviceInfo === 'object' && deviceInfo.user_agent) 
            ? deviceInfo.user_agent 
            : userAgent;
          
          // Determine platform based on user agent or device_info
          let devicePlatform = "web"; // Default to web
          if (deviceInfo.platform === 'android' || userAgentString.includes("android")) {
            devicePlatform = "android";
            androidTokens.push(deviceToken);
          } else if (
            deviceInfo.platform === 'ios' || 
            userAgentString.includes("iphone") || 
            userAgentString.includes("ipad")
          ) {
            devicePlatform = "ios";
            iosTokens.push(deviceToken);
          } else {
            webTokens.push(deviceToken);
          }
          
          platformMap.set(deviceToken, devicePlatform);
        }
        
        // Process android tokens in batches
        if (androidTokens.length > 0 && (!platform || platform === "all" || platform === "android")) {
          console.log(`Sending to ${androidTokens.length} Android devices`);
          
          // Process in batches of 500 (FCM limit)
          for (let i = 0; i < androidTokens.length; i += 500) {
            const batch = androidTokens.slice(i, i + 500);
            try {
              // Use multicast for efficiency
              // Create properly typed multicast message
              const response = await messaging.sendMulticast({
                ...androidPayload,
                tokens: batch,
                android: {
                  ...androidPayload.android,
                  priority: "high" as "high" // Ensure correct type
                }
              });
              
              // Update results
              results.sent += response.successCount;
              results.failed += response.failureCount;
              
              // Process individual results if available
              if (response.responses) {
                response.responses.forEach((resp, index) => {
                  const token = batch[index];
                  if (resp.success) {
                    results.details.push({
                      token: token.substring(0, 10) + "...",
                      platform: "android",
                      status: "success"
                    });
                  } else {
                    results.details.push({
                      token: token.substring(0, 10) + "...",
                      platform: "android",
                      status: "failed",
                      error: resp.error?.message || "Unknown error"
                    });
                  }
                });
              }
            } catch (error: any) {
              console.error(`Error sending Android batch:`, error);
              results.failed += batch.length;
              batch.forEach(token => {
                results.details.push({
                  token: token.substring(0, 10) + "...",
                  platform: "android",
                  status: "failed",
                  error: error.message
                });
              });
            }
          }
        }
        
        // Process iOS tokens in batches
        if (iosTokens.length > 0 && (!platform || platform === "all" || platform === "ios")) {
          console.log(`Sending to ${iosTokens.length} iOS devices`);
          
          // Process in batches of 500 (FCM limit)
          for (let i = 0; i < iosTokens.length; i += 500) {
            const batch = iosTokens.slice(i, i + 500);
            try {
              // Use multicast for efficiency
              const response = await messaging.sendMulticast({
                ...iosPayload,
                tokens: batch,
                // Ensure any potential troublesome fields are properly typed
                apns: iosPayload.apns
              });
              
              // Update results
              results.sent += response.successCount;
              results.failed += response.failureCount;
              
              // Process individual results if available
              if (response.responses) {
                response.responses.forEach((resp, index) => {
                  const token = batch[index];
                  if (resp.success) {
                    results.details.push({
                      token: token.substring(0, 10) + "...",
                      platform: "ios",
                      status: "success"
                    });
                  } else {
                    results.details.push({
                      token: token.substring(0, 10) + "...",
                      platform: "ios",
                      status: "failed",
                      error: resp.error?.message || "Unknown error"
                    });
                  }
                });
              }
            } catch (error: any) {
              console.error(`Error sending iOS batch:`, error);
              results.failed += batch.length;
              batch.forEach(token => {
                results.details.push({
                  token: token.substring(0, 10) + "...",
                  platform: "ios",
                  status: "failed",
                  error: error.message
                });
              });
            }
          }
        }
        
        // Process web tokens in batches
        if (webTokens.length > 0 && (!platform || platform === "all" || platform === "web")) {
          console.log(`Sending to ${webTokens.length} Web devices`);
          
          // Process in batches of 500 (FCM limit)
          for (let i = 0; i < webTokens.length; i += 500) {
            const batch = webTokens.slice(i, i + 500);
            try {
              // Use multicast for efficiency
              const response = await messaging.sendMulticast({
                ...webPayload,
                tokens: batch,
                // Ensure webpush is properly typed
                webpush: webPayload.webpush
              });
              
              // Update results
              results.sent += response.successCount;
              results.failed += response.failureCount;
              
              // Process individual results if available
              if (response.responses) {
                response.responses.forEach((resp, index) => {
                  const token = batch[index];
                  if (resp.success) {
                    results.details.push({
                      token: token.substring(0, 10) + "...",
                      platform: "web",
                      status: "success"
                    });
                  } else {
                    results.details.push({
                      token: token.substring(0, 10) + "...",
                      platform: "web",
                      status: "failed",
                      error: resp.error?.message || "Unknown error"
                    });
                  }
                });
              }
            } catch (error: any) {
              console.error(`Error sending Web batch:`, error);
              results.failed += batch.length;
              batch.forEach(token => {
                results.details.push({
                  token: token.substring(0, 10) + "...",
                  platform: "web",
                  status: "failed",
                  error: error.message
                });
              });
            }
          }
        }
        
        results.success = results.sent > 0;
        return NextResponse.json(results);
      } catch (error: any) {
        console.error("Error sending to all devices:", error);
        return NextResponse.json(
          { error: `Failed to send to all devices: ${error.message}` },
          { status: 500 }
        );
      }
    }
    
    // Send to specific token with platform detection
    if (!platform || platform === "all") {
      // Try sending to all platforms for this token
      try {
        await messaging.send({...androidPayload, token: token});
        results.sent++;
        results.details.push({ platform: "android", status: "success" });
      } catch (error: any) {
        results.failed++;
        results.details.push({ 
          platform: "android", 
          status: "failed",
          error: error.message 
        });
      }
      
      try {
        await messaging.send({...iosPayload, token: token});
        results.sent++;
        results.details.push({ platform: "ios", status: "success" });
      } catch (error: any) {
        results.failed++;
        results.details.push({ 
          platform: "ios", 
          status: "failed",
          error: error.message 
        });
      }
      
      try {
        await messaging.send({...webPayload, token: token});
        results.sent++;
        results.details.push({ platform: "web", status: "success" });
      } catch (error: any) {
        results.failed++;
        results.details.push({ 
          platform: "web", 
          status: "failed",
          error: error.message 
        });
      }
      
      results.success = results.sent > 0;
      return NextResponse.json(results);
    } else {
      // Send to specific platform
      try {
        let response;
        if (platform === "android") {
          response = await messaging.send({...androidPayload, token: token});
        } else if (platform === "ios") {
          response = await messaging.send({...iosPayload, token: token});
        } else {
          // Default to web
          response = await messaging.send({...webPayload, token: token});
        }
        
        results.sent = 1;
        results.success = true;
        results.details.push({ platform, status: "success" });
        return NextResponse.json(results);
      } catch (error: any) {
        console.error(`Error sending to ${platform}:`, error);
        return NextResponse.json(
          { 
            success: false,
            sent: 0,
            failed: 1,
            error: `Failed to send to ${platform}: ${error.message}`,
            details: [{ platform, status: "failed", error: error.message }]
          },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error("Error processing notification request:", error);
    return NextResponse.json(
      { error: `Failed to process notification request: ${error.message}` },
      { status: 500 }
    );
  }
}
