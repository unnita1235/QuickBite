'use client';

import type { MenuCategory } from '@/lib/data';
import MenuItemCard from './MenuItemCard';

interface MenuListProps {
  menu: MenuCategory[];
}

export default function MenuList({ menu }: MenuListProps) {
  return (
    <div className="space-y-8">
      {menu.map((category) => (
        <div key={category.name}>
          <h2 className="font-headline text-3xl font-semibold tracking-tight pb-4 border-b mb-4">
            {category.name}
          </h2>
          <div className="flex flex-col">
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
