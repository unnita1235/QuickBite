'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Loader2 } from 'lucide-react';
import { api } from '@/config/api';
import type { Order } from '@/types';
import { useState, useEffect } from 'react';

type OrderStatus = Order['status'];

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.orders.getAll();
        if (response.success && response.data) {
          // Backend GET /api/orders returns { success: true, data: rows[] }
          // (verified at server/src/routes/orders.routes.js:42-45).
          const orderData = Array.isArray(response.data) ? response.data : [];
          setOrders(orderData);
        } else {
          setError(response.error || 'Could not load orders.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // All 6 statuses the backend supports (verified at server/src/routes/orders.routes.js:78)
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'preparing':
        return 'text-orange-600 bg-orange-50';
      case 'on_the_way':
        return 'text-purple-600 bg-purple-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatStatus = (status: OrderStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Orders</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || 'User'}! Here are your past orders.
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-500">Loading your orders...</span>
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Orders List */}
          {!isLoading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                // Backend items column is JSONB (verified at server/migrations/002_add_items_to_orders.sql:11).
                // Parse if it arrives as a string from the API response.
                const parsedItems: Array<{ name: string; price?: number; quantity?: number }> =
                  typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {order.restaurant_name || `Restaurant #${order.restaurant_id}`}
                          </CardTitle>
                          <CardDescription>Order #{order.id}</CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Items:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {parsedItems.map((item, idx) => (
                              <li key={idx} className="text-gray-700">
                                {item.name}
                                {item.quantity && item.quantity > 1 ? ` x${item.quantity}` : ''}
                                {item.price != null ? ` — $${Number(item.price).toFixed(2)}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-600">
                              Order Date: {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-lg font-bold text-emerald-600">
                              ${Number(order.total_amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && orders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet. Start ordering now!</p>
                <Button onClick={() => router.push('/')} className="bg-emerald-600 hover:bg-emerald-700">
                  Start Ordering
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
