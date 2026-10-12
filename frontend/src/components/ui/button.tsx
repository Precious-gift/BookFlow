'use client';

import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      error = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base tokens: Inter typography, 8-point rhythm, touch targets >= 44px on mobile
    const baseClasses =
      'relative inline-flex items-center justify-center font-medium transition-all select-none outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

    // Variant tokens per AUTHORITATIVE_FOUNDATION_v1.1.md §9.1
    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-blue-800 shadow-xs focus:ring-primary disabled:bg-primary/50 disabled:text-white/80',
      secondary:
        'bg-surface text-text-primary border border-border hover:bg-surface-secondary active:bg-surface-tertiary shadow-xs focus:ring-primary disabled:bg-surface-secondary disabled:text-text-muted disabled:border-border',
      destructive:
        'bg-surface text-status-cancelled-text border border-status-cancelled-border hover:bg-status-cancelled-bg active:bg-rose-100 shadow-xs focus:ring-status-cancelled disabled:bg-surface-secondary disabled:text-text-muted disabled:border-border',
      ghost:
        'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary focus:ring-primary disabled:text-text-muted disabled:bg-transparent',
    };

    // Sizing tokens ensuring >= 44px touch targets on mobile/tablet (§3, §8)
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'text-xs rounded-md px-3 py-1.5 min-h-[44px] sm:min-h-9 sm:py-1 gap-1.5',
      md: 'text-sm rounded-lg px-4 py-2 min-h-[44px] sm:min-h-10 gap-2',
      lg: 'text-base rounded-lg px-6 py-3 min-h-[48px] gap-2.5',
      icon: 'rounded-lg p-2 min-h-[44px] min-w-[44px] sm:min-h-10 sm:min-w-10 flex items-center justify-center',
    };

    const errorClass = error
      ? 'border-status-cancelled ring-2 ring-status-cancelled/30 text-status-cancelled-text'
      : '';

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading ? 'true' : undefined}
        aria-disabled={isDisabled ? 'true' : undefined}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${errorClass} ${widthClass} ${className}`}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
        )}
        <span className={loading ? 'opacity-90' : undefined}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
