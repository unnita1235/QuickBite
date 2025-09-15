import Link from 'next/link';
import CartSheet from './CartSheet';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline text-2xl font-bold tracking-wider text-primary">
            QuickBite
          </span>
        </Link>
        <CartSheet />
      </div>
    </header>
  );
}
