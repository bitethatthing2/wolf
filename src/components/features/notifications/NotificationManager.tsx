"use client";

import React, { useState, useEffect } from 'react';
import { useFcmNotifications } from '@/hooks/use-fcm-notifications';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BellIcon, BellOffIcon, CheckIcon, XIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationManagerProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  onStateChange?: (enabled: boolean) => void;
}

/**
 * NotificationManager component for managing push notification preferences
 */
export const NotificationManager: React.FC<NotificationManagerProps> = ({
  className,
  variant = 'default',
  onStateChange
}) => {
  const {
    fcmToken,
    notificationsEnabled,
    isRegistering,
    registerForNotifications,
    unregisterFromNotifications,
    checkNotificationStatus
  } = useFcmNotifications();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Check if notifications are supported in this browser
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window;
      setIsSupported(supported);
      
      // If not supported, show error
      if (!supported) {
        setShowError('Notifications are not supported in this browser');
      }
      
      return supported;
    };
    
    // Check if we have service worker support
    const checkServiceWorkerSupport = () => {
      const supported = 'serviceWorker' in navigator;
      if (!supported) {
        setShowError('Service workers are not supported in this browser');
        setIsSupported(false);
      }
      return supported;
    };
    
    // Initial checks
    const notificationsSupported = checkSupport();
    const serviceWorkerSupported = checkServiceWorkerSupport();
    
    // If supported, check status
    if (notificationsSupported && serviceWorkerSupported) {
      checkNotificationStatus();
    }
  }, [checkNotificationStatus]);

  // Call onStateChange when notification state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(notificationsEnabled);
    }
  }, [notificationsEnabled, onStateChange]);

  const handleToggleNotifications = async () => {
    // Clear previous states
    setShowSuccess(false);
    setShowError(null);
    
    if (notificationsEnabled) {
      const success = await unregisterFromNotifications();
      if (success) {
        // Unregistering successful
      } else {
        setShowError('Failed to disable notifications');
      }
    } else {
      try {
        const success = await registerForNotifications();
        if (success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          setShowError('Failed to enable notifications');
        }
      } catch (error) {
        console.error('Error registering for notifications:', error);
        setShowError('An error occurred while enabling notifications');
      }
    }
  };

  // If notifications aren't supported, show unsupported message
  if (!isSupported) {
    if (variant === 'compact') {
      return (
        <div className={cn("flex items-center space-x-2 text-muted-foreground", className)}>
          <InfoIcon className="h-4 w-4" />
          <span className="text-sm">Notifications not supported</span>
        </div>
      );
    }
    
    if (variant === 'inline') {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled={true}
          className={cn("gap-2 cursor-not-allowed", className)}
        >
          <BellOffIcon className="h-4 w-4" />
          <span>Notifications not supported</span>
        </Button>
      );
    }
    
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Unfortunately, push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm">
            <p>To receive notifications, please use a supported browser like Chrome, Firefox, Edge, or Safari.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant - just a switch with label
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Switch
          id="notification-toggle"
          checked={notificationsEnabled}
          onCheckedChange={handleToggleNotifications}
          disabled={isRegistering}
        />
        <label
          htmlFor="notification-toggle"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
        </label>
        
        {isRegistering && (
          <span className="text-xs text-muted-foreground animate-pulse ml-2">
            Working...
          </span>
        )}
      </div>
    );
  }

  // Inline variant - button with icon
  if (variant === 'inline') {
    return (
      <Button
        variant={notificationsEnabled ? "default" : "outline"}
        size="sm"
        onClick={handleToggleNotifications}
        disabled={isRegistering}
        className={cn("gap-2", className)}
      >
        {isRegistering ? (
          <>
            <span className="h-4 w-4 animate-spin">⏳</span>
            <span>Processing...</span>
          </>
        ) : notificationsEnabled ? (
          <>
            <BellIcon className="h-4 w-4" />
            <span>Notifications On</span>
          </>
        ) : (
          <>
            <BellOffIcon className="h-4 w-4" />
            <span>Enable Notifications</span>
          </>
        )}
      </Button>
    );
  }

  // Default variant - full card with description
  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {notificationsEnabled ? (
            <BellIcon className="h-5 w-5 text-green-500" />
          ) : (
            <BellOffIcon className="h-5 w-5 text-muted-foreground" />
          )}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about special events, promotions, and updates from Side Hustle Bar.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {notificationsEnabled ? 'Notifications are enabled' : 'Notifications are disabled'}
              {isRegistering && <span className="text-xs text-muted-foreground animate-pulse ml-2">Working...</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              {notificationsEnabled 
                ? 'You will receive updates from Side Hustle Bar' 
                : 'Enable to stay updated with the latest news'}
            </p>
          </div>
          
          <Switch
            id="notification-toggle-card"
            checked={notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
            disabled={isRegistering}
          />
        </div>
        
        {showSuccess && (
          <div className="mt-4 p-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4" />
            <span>Notifications enabled successfully!</span>
          </div>
        )}
        
        {showError && (
          <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md flex items-center gap-2 text-sm">
            <XIcon className="h-4 w-4" />
            <span>{showError}</span>
          </div>
        )}
        
        {fcmToken && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-muted-foreground">
            <p>Your device is registered to receive notifications.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        You can change your notification preferences at any time.
      </CardFooter>
    </Card>
  );
};

export default NotificationManager;
