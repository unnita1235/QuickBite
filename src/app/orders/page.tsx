'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  quantity?: number;
}

interface Order {
  id: string;
  restaurant_name?: string;
  restaurantName?: string;
  items: OrderItem[] | string[];
  total_amount?: number;
  totalAmount?: number;
  total?: number;
  status: OrderStatus;
  created_at?: string;
  createdAt?: string;
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'on_the_way':
      return 'On the Way';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getStatusClasses(status: OrderStatus): string {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'preparing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'on_the_way':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function formatOrderDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy \'at\' h:mm a');
  } catch {
    return dateStr;
  }
}

function getItemDisplay(item: OrderItem | string): string {
  if (typeof item === 'string') return item;
  if (item.quantity && item.quantity > 1) return `${item.name} x${item.quantity}`;
  return item.name;
}

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders || data || []);
      } catch (err: any) {
        console.error('Failed to fetch orders:', err);
        setError(err.message || 'Could not load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight mb-2">Your Orders</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'User'}! Here are your orders.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-60" />
                      <Skeleton className="h-4 w-48" />
                      <div className="flex justify-between pt-4 border-t mt-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Browse restaurants to place your first order!
                </p>
                <Button asChild>
                  <Link href="/">Browse Restaurants</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const restaurantName = order.restaurant_name || order.restaurantName || 'Restaurant';
                const totalAmount = order.total_amount || order.totalAmount || order.total || 0;
                const dateStr = order.created_at || order.createdAt || '';
                const status = order.status || 'pending';

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{restaurantName}</CardTitle>
                          <CardDescription>Order #{order.id}</CardDescription>
                        </div>
                        <Badge className={getStatusClasses(status)}>
                          {getStatusLabel(status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Items:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
                              <li key={idx} className="text-sm">
                                {getItemDisplay(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            {dateStr && (
                              <p className="text-sm text-muted-foreground">
                                {formatOrderDate(dateStr)}
                              </p>
                            )}
                          </div>
                          <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
