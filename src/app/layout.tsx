import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/useCart';
import Header from '@/components/Header';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import { EnvValidator } from '@/components/EnvValidator';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#10b981',
};

export const metadata: Metadata = {
  title: {
    default: 'QuickBite - Food Delivery Made Easy',
    template: '%s | QuickBite',
  },
  description: 'Discover local restaurants and delicious cuisines with AI-powered recommendations. Order your favorite meals, delivered right to your door.',
  keywords: ['food delivery', 'restaurants', 'online ordering', 'AI recommendations', 'local food'],
  authors: [{ name: 'Unni T A', url: 'https://github.com/unnita1235' }],
  creator: 'Unni T A',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quick-bite.vercel.app',
    title: 'QuickBite - Food Delivery Made Easy',
    description: 'Discover local restaurants and delicious cuisines with AI-powered recommendations.',
    siteName: 'QuickBite',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickBite - Food Delivery Made Easy',
    description: 'Discover local restaurants and delicious cuisines with AI-powered recommendations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ErrorBoundary>
          <EnvValidator />
          <AuthProvider>
            <CartProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
