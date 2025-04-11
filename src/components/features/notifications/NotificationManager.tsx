"use client";

import React, { useState } from 'react';
import { useFcmNotifications } from '@/hooks/use-fcm-notifications';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BellIcon, BellOffIcon, CheckIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationManagerProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

/**
 * NotificationManager component for managing push notification preferences
 */
export const NotificationManager: React.FC<NotificationManagerProps> = ({
  className,
  variant = 'default'
}) => {
  const {
    notificationsEnabled,
    isRegistering,
    registerForNotifications,
    unregisterFromNotifications
  } = useFcmNotifications();
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      await unregisterFromNotifications();
    } else {
      const success = await registerForNotifications();
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  };

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
        {notificationsEnabled ? (
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
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        You can change your notification preferences at any time.
      </CardFooter>
    </Card>
  );
};

export default NotificationManager;
