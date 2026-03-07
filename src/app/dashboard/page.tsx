'use client';

import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, MapPin, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/config/api';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await api.orders.getAll();
        if (response.success && response.data) {
          const orders = Array.isArray(response.data) ? response.data : [];
          setOrderCount(orders.length);
        } else {
          setOrderCount(0);
        }
      } catch {
        setOrderCount(0);
      }
    };

    fetchOrderCount();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Manage your QuickBite orders and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderCount === null ? '...' : orderCount}
                </div>
                <p className="text-xs text-gray-600">All time orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Email</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold truncate">{user?.email || '—'}</div>
                <p className="text-xs text-gray-600">Registered email</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Date().getFullYear()}</div>
                <p className="text-xs text-gray-600">Welcome to QuickBite</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your orders and preferences</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/orders" className="w-full">
                <Button variant="outline" className="w-full">View Orders</Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">Order Food</Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
