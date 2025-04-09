import { NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getActiveSubscriptions } from "@/lib/supabase/notification-service";
import { createPlatformPayloads } from "@/lib/utils/notification-routing";
import { getSupabaseClient } from "@/lib/supabase/client";

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
      if (process.env.PRIVATE_KEY && process.env.PROJECT_ID && process.env.client_email) {
        const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
        initializeApp({
          credential: cert({
            projectId: process.env.PROJECT_ID,
            clientEmail: process.env.client_email,
            privateKey: privateKey,
          }),
          storageBucket: process.env.STORAGE_BUCKET,
        });
        console.log("Firebase Admin initialized within POST handler.");
      } else {
        console.error("Firebase Admin SDK credentials not available during API call.");
        // Return an error immediately if creds are missing when the API is called
        return NextResponse.json(
          { error: "Server configuration error: Firebase Admin credentials missing." },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Firebase Admin initialization error within POST handler:", error);
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
        // Get all active subscriptions from Supabase
        const supabase = getSupabaseClient();
        const subscriptions = await getActiveSubscriptions(supabase);
        
        if (subscriptions.length === 0) {
          return NextResponse.json(
            { error: "No active subscriptions found" },
            { status: 404 }
          );
        }

        console.log(`Sending notifications to ${subscriptions.length} devices`);
        
        // Send to each device with platform detection
        for (const subscription of subscriptions) {
          const deviceToken = subscription.endpoint;
          const userAgent = subscription.user_agent?.toLowerCase() || '';
          
          // Determine platform based on user agent
          let devicePlatform = "web"; // Default to web
          if (userAgent.includes("android")) {
            devicePlatform = "android";
          } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
            devicePlatform = "ios";
          }
          
          // Skip if we're targeting a specific platform and this device doesn't match
          if (platform && platform !== "all" && platform !== devicePlatform) {
            continue;
          }
          
          try {
            if (devicePlatform === "android") {
              await messaging.send({...androidPayload, token: deviceToken});
            } else if (devicePlatform === "ios") {
              await messaging.send({...iosPayload, token: deviceToken});
            } else {
              await messaging.send({...webPayload, token: deviceToken});
            }
            
            results.sent++;
            results.details.push({ 
              token: deviceToken.substring(0, 10) + "...", 
              platform: devicePlatform,
              status: "success" 
            });
          } catch (error: any) {
            results.failed++;
            results.details.push({ 
              token: deviceToken.substring(0, 10) + "...", 
              platform: devicePlatform,
              status: "failed",
              error: error.message 
            });
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
        await messaging.send({...androidPayload, token});
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
        await messaging.send({...iosPayload, token});
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
        await messaging.send({...webPayload, token});
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
          response = await messaging.send({...androidPayload, token});
        } else if (platform === "ios") {
          response = await messaging.send({...iosPayload, token});
        } else {
          // Default to web
          response = await messaging.send({...webPayload, token});
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
