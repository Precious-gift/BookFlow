'use client';

import React from 'react';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type StatusBadgeSize = 'sm' | 'md' | 'lg';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: AppointmentStatus;
  size?: StatusBadgeSize;
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
}

export function StatusBadge({
  status = 'Pending',
  size = 'md',
  loading = false,
  disabled = false,
  error = false,
  label,
  className = '',
  ...props
}: StatusBadgeProps) {
  if (loading) {
    return (
      <span
        aria-busy="true"
        aria-label="Loading appointment status"
        className={`
          inline-flex items-center rounded-sm border border-border bg-surface-secondary text-text-muted animate-pulse
          ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}
          ${className}
        `}
        {...props}
      >
        <span className="h-2 w-2 rounded-full bg-text-muted/60 animate-ping mr-1.5" />
        <span className="font-normal opacity-80">Loading...</span>
      </span>
    );
  }

  if (error) {
    return (
      <span
        role="status"
        aria-label="Status error"
        className={`
          inline-flex items-center rounded-sm border border-status-cancelled-border bg-status-cancelled-bg text-status-cancelled-text font-medium
          ${size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : size === 'lg' ? 'px-3.5 py-1.5 text-sm gap-2' : 'px-2.5 py-1 text-xs gap-1.5'}
          ${className}
        `}
        {...props}
      >
        {/* Warning Icon */}
        <svg
          className="h-3 w-3 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.516 2.63H3.72c-1.347 0-2.189-1.463-1.516-2.63L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <span>{label || 'Error'}</span>
      </span>
    );
  }

  if (disabled) {
    return (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props
      <span
        role="status"
        aria-label={`Status: ${label || status} (Disabled)`}
        aria-disabled="true"
        className={`
          inline-flex items-center rounded-sm border border-border bg-surface-secondary text-text-muted font-medium opacity-60
          ${size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : size === 'lg' ? 'px-3.5 py-1.5 text-sm gap-2' : 'px-2.5 py-1 text-xs gap-1.5'}
          ${className}
        `}
        {...props}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
        <span>{label || status}</span>
      </span>
    );
  }

  // Tokens per AUTHORITATIVE_FOUNDATION_v1.1.md §6
  const statusConfig = {
    Pending: {
      text: 'text-status-pending-text',
      bg: 'bg-status-pending-bg',
      border: 'border-status-pending-border',
      icon: (
        // Clock / Dot icon for Pending
        <svg
          className="h-3 w-3 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 001.06-1.06l-2.78-2.78V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    Confirmed: {
      text: 'text-status-confirmed-text',
      bg: 'bg-status-confirmed-bg',
      border: 'border-status-confirmed-border',
      icon: (
        // Checkmark icon for Confirmed
        <svg
          className="h-3 w-3 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    Completed: {
      text: 'text-status-completed-text',
      bg: 'bg-status-completed-bg',
      border: 'border-status-completed-border',
      icon: (
        // Solid Circle Check icon for Completed
        <svg
          className="h-3 w-3 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    Cancelled: {
      text: 'text-status-cancelled-text',
      bg: 'bg-status-cancelled-bg',
      border: 'border-status-cancelled-border',
      icon: (
        // Cross icon for Cancelled
        <svg
          className="h-3 w-3 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      ),
    },
  };

  const current = statusConfig[status];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      role="status"
      aria-label={`Status: ${label || status}`}
      className={`
        inline-flex items-center rounded-sm border font-medium select-none transition-colors
        ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {current.icon}
      <span>{label || status}</span>
    </span>
  );
}
