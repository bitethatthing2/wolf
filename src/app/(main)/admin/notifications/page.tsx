"use client";

import { useState } from 'react';
import { NotificationTester } from '@/components/features/notifications/NotificationTester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActiveSubscriptions } from '@/lib/supabase/notification-service';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, BellRing } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const subs = await getActiveSubscriptions(supabase);
      setSubscriptions(subs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BellRing className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Notification Management</h1>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Send notifications to your users and manage notification subscriptions.
      </p>
      
      <Tabs defaultValue="send">
        <TabsList className="mb-6">
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-4">
          <NotificationTester adminMode={true} className="max-w-xl" />
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Notification Subscriptions
                  </CardTitle>
                  <CardDescription>
                    View all devices registered for push notifications
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchSubscriptions}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              {subscriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {loading ? (
                    <p>Loading subscriptions...</p>
                  ) : (
                    <>
                      <p>No subscriptions found.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchSubscriptions}
                        className="mt-2"
                      >
                        Load Subscriptions
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">ID</th>
                        <th className="text-left p-3 font-medium">Device</th>
                        <th className="text-left p-3 font-medium">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub) => (
                        <tr key={sub.id} className="border-b">
                          <td className="p-3 text-sm">
                            <span className="font-mono">{sub.id.substring(0, 8)}...</span>
                          </td>
                          <td className="p-3 text-sm">
                            <div>
                              <p className="truncate max-w-[300px]" title={sub.user_agent}>
                                {sub.user_agent || 'Unknown device'}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[300px]" title={sub.endpoint}>
                                {sub.endpoint.substring(0, 20)}...
                              </p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            {sub.last_active ? new Date(sub.last_active).toLocaleString() : 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
