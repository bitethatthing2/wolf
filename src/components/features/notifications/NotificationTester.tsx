"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFcmNotifications } from '@/hooks/use-fcm-notifications';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

interface NotificationTesterProps {
  className?: string;
  adminMode?: boolean;
}

export function NotificationTester({ className, adminMode = false }: NotificationTesterProps) {
  const { fcmToken, notificationsEnabled } = useFcmNotifications();
  
  const [title, setTitle] = useState('Hustle Hard');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('/');
  const [platform, setPlatform] = useState('web');
  const [sendToAll, setSendToAll] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      setResult({
        status: 'success',
        message: `Notification sent successfully! ${data.sent} sent, ${data.failed} failed.`,
        details: data
      });
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
