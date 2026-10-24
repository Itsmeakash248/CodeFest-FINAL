'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--text-primary)] border border-[var(--outline)]/40 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-[var(--primary)] transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--text-primary)] transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
