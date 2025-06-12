'use client';

import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 lg:h-16 items-center">
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 px-3 sm:px-4 lg:px-8">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
          <h1 className="text-base sm:text-lg lg:text-2xl font-bold tracking-tight line-clamp-1">
            CISO Work Cycle
          </h1>
        </div>
      </div>
    </header>
  );
}