'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--background)]/85 border-b border-[var(--outline)]/30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full px-2 py-1 -ml-2"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[var(--surface-container)] flex items-center justify-center p-1 border border-[var(--outline)]/40 shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="MoonCraft ViewPilot Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-hero font-bold text-lg sm:text-xl tracking-tight text-[var(--text-primary)]">
                ViewPilot
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]">
                AI Coach
              </span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-medium -mt-0.5">
              by Team MoonCraft
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/setup"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-[var(--text-primary)] bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline)]/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Practice Session</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
