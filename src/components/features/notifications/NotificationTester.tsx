"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFcmNotifications } from '@/hooks/use-fcm-notifications';
import { AlertCircle, CheckCircle2, Send, InfoIcon } from 'lucide-react';

interface NotificationTesterProps {
  className?: string;
  adminMode?: boolean;
}

export function NotificationTester({ className, adminMode = false }: NotificationTesterProps) {
  const { fcmToken, notificationsEnabled, checkNotificationStatus } = useFcmNotifications();
  
  const [title, setTitle] = useState('Side Hustle Bar');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('/');
  const [platform, setPlatform] = useState('web');
  const [sendToAll, setSendToAll] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [swStatus, setSwStatus] = useState<{ registered: boolean, active: boolean, scope?: string }>({
    registered: false,
    active: false
  });
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  // Check service worker status
  useEffect(() => {
    const checkServiceWorker = async () => {
      if (!('serviceWorker' in navigator)) {
        setSwStatus({ registered: false, active: false });
        return;
      }

      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const hasRegistration = registrations.length > 0;
        const mainRegistration = registrations.find(reg => 
          reg.active && (reg.scope.includes(window.location.origin) || reg.scope === '/')
        );
        
        setSwStatus({
          registered: hasRegistration,
          active: Boolean(mainRegistration?.active),
          scope: mainRegistration?.scope
        });
      } catch (error) {
        console.error('Error checking service worker status:', error);
        setSwStatus({ registered: false, active: false });
      }
    };

    checkServiceWorker();
    
    // Also verify notification status
    checkNotificationStatus();
  }, [checkNotificationStatus]);

  // Generate a diagnostic report
  const generateDiagnostics = () => {
    const diagnostics = {
      browser: navigator.userAgent,
      notifications: {
        permission: Notification.permission,
        enabled: notificationsEnabled,
        fcmToken: fcmToken ? `${fcmToken.substring(0, 10)}...` : 'None',
      },
      serviceWorker: {
        supported: 'serviceWorker' in navigator,
        registered: swStatus.registered,
        active: swStatus.active,
        scope: swStatus.scope,
      },
      appState: typeof window !== 'undefined' && window.__wolfAppInit ? {
        serviceWorkerRegistered: window.__wolfAppInit.serviceWorkerRegistered,
        pushNotificationsInitialized: window.__wolfAppInit.pushNotificationsInitialized,
        errors: window.__wolfAppInit.errors.length > 0 ? 
          window.__wolfAppInit.errors.slice(0, 3).join(', ') + 
          (window.__wolfAppInit.errors.length > 3 ? ` (and ${window.__wolfAppInit.errors.length - 3} more)` : '') : 
          'None',
      } : 'Not available'
    };

    return JSON.stringify(diagnostics, null, 2);
  };

  const refreshServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      setResult({
        status: 'error',
        message: 'Service Worker API not available in this browser'
      });
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length === 0) {
        // Try to register a new service worker
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        setResult({
          status: 'success',
          message: `New service worker registered with scope: ${registration.scope}`
        });
      } else {
        // Update existing service workers
        await Promise.all(
          registrations.map(async registration => {
            await registration.update();
          })
        );
        setResult({
          status: 'success',
          message: `Updated ${registrations.length} service worker(s)`
        });
      }

      // Recheck status
      const newRegistrations = await navigator.serviceWorker.getRegistrations();
      const mainRegistration = newRegistrations.find(reg => 
        reg.active && (reg.scope.includes(window.location.origin) || reg.scope === '/')
      );
      
      setSwStatus({
        registered: newRegistrations.length > 0,
        active: Boolean(mainRegistration?.active),
        scope: mainRegistration?.scope
      });
    } catch (error: any) {
      setResult({
        status: 'error',
        message: `Service worker refresh failed: ${error.message}`
      });
    }
  };

  const sendNotification = async () => {
    if (!title || !message) {
      setResult({
        status: 'error',
        message: 'Title and message are required'
      });
      return;
    }

    if (!fcmToken && !sendToAll) {
      setResult({
        status: 'error',
        message: 'No FCM token available. Enable notifications first or use "Send to All" option.'
      });
      return;
    }

    setIsSending(true);
    setResult({ status: 'idle', message: '' });

    try {
      // First verify notification status
      await checkNotificationStatus();
      
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: fcmToken || 'test-token-for-ui-development',
          title,
          message,
          link,
          platform,
          sendToAll: adminMode ? sendToAll : false, // Only allow sendToAll in admin mode
          // Add diagnostic data if in admin mode
          diagnostics: adminMode ? {
            userAgent: navigator.userAgent,
            swRegistered: swStatus.registered,
            swActive: swStatus.active,
            timestamp: new Date().toISOString()
          } : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      setResult({
        status: 'success',
        message: `Notification sent successfully! ${data.sent || 0} sent, ${data.failed || 0} failed.`,
        details: data
      });
      
      // Also test local notification if in admin mode and not sending to all
      if (adminMode && !sendToAll && Notification.permission === 'granted') {
        try {
          const localNotification = new Notification(title, {
            body: message,
            icon: '/logo-main-dark.png',
            tag: 'test-notification',
            data: { url: link, source: 'tester' }
          });
          
          localNotification.onclick = () => {
            window.focus();
            if (link) window.location.href = link;
            localNotification.close();
          };
        } catch (localError) {
          console.warn('Local notification test failed:', localError);
        }
      }
    } catch (error: any) {
      setResult({
        status: 'error',
        message: error.message || 'Failed to send notification'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Test Notifications</CardTitle>
        <CardDescription>
          {adminMode 
            ? 'Send test notifications to specific devices or all registered users.' 
            : 'Send a test notification to your device.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!notificationsEnabled && !adminMode && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Notifications not enabled</AlertTitle>
            <AlertDescription>
              You need to enable notifications to receive test messages.
            </AlertDescription>
          </Alert>
        )}
        
        {adminMode && (
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Service Worker Status</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshServiceWorker} 
                className="h-7 px-2 text-xs"
              >
                Refresh
              </Button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <span className="text-gray-500 dark:text-gray-400">Registered:</span>
              <span className={swStatus.registered ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {swStatus.registered ? 'Yes' : 'No'}
              </span>
              
              <span className="text-gray-500 dark:text-gray-400">Active:</span>
              <span className={swStatus.active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {swStatus.active ? 'Yes' : 'No'}
              </span>
              
              <span className="text-gray-500 dark:text-gray-400">Scope:</span>
              <span className="text-gray-800 dark:text-gray-200">
                {swStatus.scope || 'N/A'}
              </span>
              
              <span className="text-gray-500 dark:text-gray-400">FCM Token:</span>
              <span className="text-gray-800 dark:text-gray-200">
                {fcmToken ? 'Available' : 'Missing'}
              </span>
            </div>
            
            <div className="mt-2 flex items-center">
              <Switch
                id="show-diagnostics"
                checked={showDiagnostics}
                onCheckedChange={setShowDiagnostics}
                className="mr-2"
              />
              <Label htmlFor="show-diagnostics" className="text-xs">Show diagnostics</Label>
            </div>
            
            {showDiagnostics && (
              <pre className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
                {generateDiagnostics()}
              </pre>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="notification-title">Title</Label>
          <Input
            id="notification-title"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notification-message">Message</Label>
          <Textarea
            id="notification-message"
            placeholder="Enter your notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notification-link">Link (optional)</Label>
          <Input
            id="notification-link"
            placeholder="e.g., /events"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notification-platform">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="notification-platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
              <SelectItem value="all">All Platforms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {adminMode && (
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="send-to-all"
              checked={sendToAll}
              onCheckedChange={setSendToAll}
            />
            <Label htmlFor="send-to-all">Send to all registered devices</Label>
          </div>
        )}
        
        {result.status !== 'idle' && (
          <Alert variant={result.status === 'success' ? 'default' : 'destructive'}>
            {result.status === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {result.status === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={sendNotification} 
          disabled={isSending || (!notificationsEnabled && !adminMode && !sendToAll)}
          className="w-full"
        >
          {isSending ? 'Sending...' : 'Send Test Notification'}
          {!isSending && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
