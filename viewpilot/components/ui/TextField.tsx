'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] pl-2"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 pointer-events-none text-[var(--text-secondary)] flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/70 text-sm md:text-base rounded-[22px] border border-[var(--outline)]/50 px-5 py-3.5 transition-all duration-200 outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
                leftIcon && 'pl-11',
                rightIcon && 'pr-11',
                error && 'border-[var(--error)] focus:ring-[var(--error)]',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 text-[var(--text-secondary)] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[var(--error)] pl-2 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-secondary)] pl-2">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
