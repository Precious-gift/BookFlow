'use client';

import React, { forwardRef } from 'react';

export interface TimeChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  time: string;
  period?: string;
  selected?: boolean;
  loading?: boolean;
  error?: boolean;
  subtext?: string;
}

export const TimeChip = forwardRef<HTMLButtonElement, TimeChipProps>(
  (
    {
      time,
      period,
      selected = false,
      disabled = false,
      loading = false,
      error = false,
      subtext,
      className = '',
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        aria-pressed={selected}
        aria-disabled={isDisabled ? 'true' : undefined}
        aria-busy={loading ? 'true' : undefined}
        className={`
          relative inline-flex flex-col items-center justify-center
          min-h-[44px] min-w-[80px] sm:min-h-10 px-3.5 py-1.5
          rounded-lg text-sm font-medium transition-all select-none
          border outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
          ${
            loading
              ? 'bg-surface-secondary border-border text-text-muted animate-pulse cursor-not-allowed'
              : error
              ? 'bg-status-cancelled-bg text-status-cancelled-text border-status-cancelled-border hover:bg-rose-100'
              : selected
              ? 'bg-primary text-white border-primary shadow-xs font-semibold'
              : isDisabled
              ? 'bg-surface-secondary text-text-muted border-border cursor-not-allowed line-through opacity-70'
              : 'bg-surface text-text-primary border-border hover:border-primary hover:text-primary hover:shadow-xs active:bg-surface-secondary'
          }
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1 leading-tight">
              <span className="tabular-nums tracking-tight">{time}</span>
              {period && (
                <span className={`text-[11px] uppercase ${selected ? 'text-white/90' : 'text-text-muted'}`}>
                  {period}
                </span>
              )}
            </div>
            {subtext && (
              <span
                className={`text-[10px] mt-0.5 leading-none ${
                  selected ? 'text-white/80' : 'text-text-muted'
                }`}
              >
                {subtext}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

TimeChip.displayName = 'TimeChip';
