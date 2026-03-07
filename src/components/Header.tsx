'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CartSheet from './CartSheet';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LogOut, User, Menu, Home, ShoppingBag, UserPlus, LogIn } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-headline text-xl text-emerald-600">QuickBite</SheetTitle>
                <SheetDescription className="sr-only">Navigation menu</SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1 mt-6">
                <button
                  onClick={() => navigateTo('/')}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors text-left"
                >
                  <Home className="h-4 w-4" /> Home
                </button>

                {user && (
                  <button
                    onClick={() => navigateTo('/orders')}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors text-left"
                  >
                    <ShoppingBag className="h-4 w-4" /> My Orders
                  </button>
                )}

                {user && (
                  <button
                    onClick={() => navigateTo('/dashboard')}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors text-left"
                  >
                    <User className="h-4 w-4" /> Dashboard
                  </button>
                )}
              </nav>

              <Separator className="my-4" />

              {user ? (
                <div className="space-y-3">
                  <div className="px-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigateTo('/login')}>
                    <LogIn className="h-4 w-4" /> Login
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigateTo('/register')}>
                    <UserPlus className="h-4 w-4" /> Sign Up
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-headline text-2xl font-bold text-emerald-600">
            QuickBite
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6 flex-1 ml-8">
          <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition">
            Home
          </Link>
          {user && (
            <Link href="/orders" className="text-sm font-medium hover:text-emerald-600 transition">
              My Orders
            </Link>
          )}
        </nav>

        {/* Right section - Cart and Auth */}
        <div className="flex items-center space-x-4">
          <CartSheet />

          {user ? (
            <div className="hidden md:flex items-center space-x-3 pl-4 border-l">
              <div className="text-right">
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
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l">
              <Button variant="ghost" onClick={() => router.push('/login')} className="text-sm">
                Login
              </Button>
              <Button onClick={() => router.push('/register')} className="bg-emerald-600 hover:bg-emerald-700 text-sm">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
