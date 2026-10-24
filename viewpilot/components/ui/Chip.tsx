'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
  showCheckmark?: boolean;
}

export function Chip({
  children,
  selected = false,
  icon,
  showCheckmark = true,
  className,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={twMerge(
        clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)] active:scale-95',
          selected
            ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border-[var(--primary)] shadow-xs font-semibold'
            : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--outline)]/50 hover:bg-[var(--surface-container)] hover:text-[var(--text-primary)]',
          className
        )
      )}
      {...props}
    >
      {selected && showCheckmark && (
        <Check className="w-3.5 h-3.5 stroke-[2.5] text-[var(--primary)] animate-in fade-in zoom-in-75 duration-150" />
      )}
      {!selected && icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
