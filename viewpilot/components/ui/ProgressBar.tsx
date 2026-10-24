'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  max?: number;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'auto';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  size = 'md',
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let colorClass = 'bg-[var(--primary)]';
  if (variant === 'secondary') {
    colorClass = 'bg-[var(--secondary)]';
  } else if (variant === 'tertiary') {
    colorClass = 'bg-[var(--tertiary)]';
  } else if (variant === 'success' || (variant === 'auto' && percentage >= 75)) {
    colorClass = 'bg-[var(--success)]';
  } else if (variant === 'warning' || (variant === 'auto' && percentage >= 50 && percentage < 75)) {
    colorClass = 'bg-[var(--warning)]';
  } else if (variant === 'error' || (variant === 'auto' && percentage < 50)) {
    colorClass = 'bg-[var(--error)]';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={twMerge('w-full flex flex-col gap-1.5', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-secondary)]">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-[var(--surface-container)] rounded-full overflow-hidden border border-[var(--outline)]/20',
          heightClasses[size]
        )}
      >
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
