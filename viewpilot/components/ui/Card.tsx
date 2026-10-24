'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined' | 'tonal';
  interactive?: boolean;
}

export function Card({
  children,
  variant = 'elevated',
  interactive = false,
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-[28px] p-6 transition-all duration-200';

  const variantStyles = {
    elevated:
      'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--outline)]/30 shadow-expressive-sm hover:shadow-expressive-md',
    filled:
      'bg-[var(--surface-container)] text-[var(--text-primary)] border-none',
    tonal:
      'bg-[var(--surface-container-high)] text-[var(--text-primary)] border border-[var(--outline)]/20',
    outlined:
      'bg-transparent text-[var(--text-primary)] border border-[var(--outline)]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]'
    : '';

  return (
    <div
      className={twMerge(clsx(baseStyles, variantStyles[variant], interactiveStyles, className))}
      {...props}
    >
      {children}
    </div>
  );
}
