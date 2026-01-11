'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { OrderSkeleton } from '@/components/OrderSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getOrders();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'confirmed':
      case 'preparing':
      case 'on_the_way':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
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

          {/* Orders List */}
          {loading ? (
            <div className="space-y-4">
              <OrderSkeleton />
              <OrderSkeleton />
              <OrderSkeleton />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{order.restaurant_name || `Restaurant #${order.restaurant_id}`}</CardTitle>
                        <CardDescription>Order #{order.id}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-gray-700">
                              {item.name} x {item.quantity} - ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {order.delivery_address && (
                        <div>
                          <h4 className="font-semibold mb-1">Delivery Address:</h4>
                          <p className="text-gray-700">{order.delivery_address}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="text-lg font-bold text-emerald-600">₹{order.total_amount}</p>
                        </div>
                        <Button variant="outline" onClick={() => router.push(`/orders/${order.id}`)}
                          className="w-full h-4 text-4">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start ordering now!</p>
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
