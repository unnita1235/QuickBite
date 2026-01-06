'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CartSheet from './CartSheet';
import { Button } from '@/components/ui/button';
import { LogOut, User, ShoppingBag, Menu } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="font-headline text-2xl font-bold text-emerald-600">
          QuickBite
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 flex-1 ml-8">
          <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition">
            Home
          </Link>
          {user && (
            <>
              <Link href="/orders" className="text-sm font-medium hover:text-emerald-600 transition">
                My Orders
              </Link>
            </>
          )}
        </nav>

        {/* Right section - Cart and Auth */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <CartSheet />

          {/* Auth Section */}
          {user ? (
            // Logged in user menu
            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-emerald-50"
                title="Dashboard"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            // Not logged in - show auth buttons
            <div className="flex items-center space-x-2 pl-4 border-l">
              <Button
                variant="ghost"
                onClick={handleLoginClick}
                className="text-sm"
              >
                Login
              </Button>
              <Button
                onClick={handleRegisterClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-sm"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
