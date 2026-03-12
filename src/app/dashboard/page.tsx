'use client';

import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, MapPin, CreditCard, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.users.getProfile();
        if (response.success && response.data) {
          const d = response.data;
          setProfile({
            firstName: d.name ?? '',
            lastName: d.last_name ?? '',
            phone: d.phone ?? '',
            email: d.email ?? '',
          });
        } else if (user) {
          setProfile({
            firstName: user.name ?? '',
            lastName: user.last_name ?? '',
            phone: user.phone ?? '',
            email: user.email ?? '',
          });
        }
      } catch {
        if (user) {
          setProfile({
            firstName: user.name ?? '',
            lastName: user.last_name ?? '',
            phone: user.phone ?? '',
            email: user.email ?? '',
          });
        }
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const response = await api.users.updateProfile(
        profile.firstName,
        profile.lastName,
        profile.phone,
        profile.email
      );
      if (response.success) {
        await refreshUser();
        toast({
          title: 'Profile updated',
          description: 'Your profile has been saved.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: response.error ?? 'Could not update profile.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setProfileSaving(false);
    }
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
                <div className="text-2xl font-bold">
                  {user?.created_at
                    ? new Date(user.created_at).getFullYear()
                    : new Date().getFullYear()}
                </div>
                <p className="text-xs text-gray-600">Welcome to QuickBite</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Edit Profile
              </CardTitle>
              <CardDescription>Update your name, phone, and email</CardDescription>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <p className="text-sm text-muted-foreground">Loading profile...</p>
              ) : (
                <form onSubmit={handleProfileSubmit} className="grid gap-4 max-w-md">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                      className="mt-1"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                      className="mt-1"
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      className="mt-1"
                      placeholder="Phone (optional)"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      className="mt-1"
                      placeholder="Email"
                    />
                  </div>
                  <Button type="submit" disabled={profileSaving}>
                    {profileSaving ? 'Saving...' : 'Save profile'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

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
