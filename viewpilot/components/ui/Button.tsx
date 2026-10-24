'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tonal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-full';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 min-h-[36px] gap-1.5',
    md: 'text-sm px-6 py-3 min-h-[44px] gap-2 font-medium',
    lg: 'text-base px-8 py-3.5 min-h-[50px] gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-105 active:brightness-95 shadow-sm focus-visible:ring-[var(--primary)]',
    secondary:
      'bg-[var(--secondary)] text-[#FFFFFF] hover:brightness-105 active:brightness-95 focus-visible:ring-[var(--secondary)]',
    tonal:
      'bg-[var(--primary-container)] text-[var(--on-primary-container)] hover:brightness-95 active:brightness-90 focus-visible:ring-[var(--primary)]',
    outline:
      'border border-[var(--outline)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-container)] focus-visible:ring-[var(--primary)]',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-container)] focus-visible:ring-[var(--primary)]',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
