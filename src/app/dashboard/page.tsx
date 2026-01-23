'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, User, ClipboardList, UtensilsCrossed, Mail, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  name: string;
  email: string;
  created_at?: string;
  createdAt?: string;
}

interface Order {
  id: string;
  status: string;
  created_at?: string;
  createdAt?: string;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'on_the_way':
      return 'On the Way';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getStatusClasses(status: string): string {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'preparing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'on_the_way':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [profileRes, ordersRes] = await Promise.allSettled([
        fetch(`${apiUrl}/users/profile`, { headers }),
        fetch(`${apiUrl}/orders`, { headers }),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
        const data = await profileRes.value.json();
        setProfile(data.user || data);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const data = await ordersRes.value.json();
        setOrders(data.orders || data || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [token]);

  const totalOrders = orders.length;
  const mostRecentOrder = orders.length > 0 ? orders[0] : null;
  const mostRecentStatus = mostRecentOrder?.status || null;

  const displayName = profile?.name || user?.name || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const memberSince = profile?.created_at || profile?.createdAt || '';

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-48" />
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-5 w-36" />
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-4 w-24 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="mb-2">
                <h1 className="font-headline text-4xl font-bold tracking-tight mb-1">
                  Welcome, {displayName}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your QuickBite orders and preferences.
                </p>
              </div>

              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{displayName}</span>
                  </div>
                  {displayEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{displayEmail}</span>
                    </div>
                  )}
                  {memberSince && (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>Member since {formatDate(memberSince)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {totalOrders === 0 ? 'No orders yet' : 'All time orders'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Recent Order</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {mostRecentStatus ? (
                      <>
                        <Badge className={getStatusClasses(mostRecentStatus)}>
                          {getStatusLabel(mostRecentStatus)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          Order #{mostRecentOrder?.id}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No orders yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Navigate to common tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">
                      <UtensilsCrossed className="mr-2 h-4 w-4" />
                      Browse Restaurants
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      View Orders
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
