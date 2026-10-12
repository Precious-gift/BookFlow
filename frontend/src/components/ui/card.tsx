'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  interactive?: boolean;
}

export function Card({
  loading = false,
  disabled = false,
  error,
  interactive = false,
  className = '',
  children,
  ...props
}: CardProps) {
  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading card content"
        className={`rounded-lg border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4 ${className}`}
        {...props}
      >
        <div className="h-4 w-1/3 rounded-md bg-surface-tertiary" />
        <div className="h-8 w-2/3 rounded-md bg-surface-secondary" />
        <div className="h-3 w-1/2 rounded-md bg-surface-tertiary" />
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-lg border border-border bg-surface p-6 shadow-xs transition-all text-left
        ${interactive ? 'hover:border-border-hover hover:shadow-sm cursor-pointer select-none active:bg-surface-secondary/50 min-h-[44px]' : ''}
        ${disabled ? 'opacity-60 pointer-events-none cursor-not-allowed bg-surface-secondary/40' : ''}
        ${error ? 'border-status-cancelled-border bg-rose-50/20' : ''}
        ${className}
      `}
      {...props}
    >
      {error && (
        <div className="mb-4 rounded-md bg-status-cancelled-bg border border-status-cancelled-border p-2.5 text-xs text-status-cancelled-text flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {children}
    </div>
  );
}

export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-start justify-between gap-4 pb-4 border-b border-surface-tertiary mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-base font-semibold text-text-primary tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-text-secondary mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pt-4 border-t border-surface-tertiary mt-4 flex items-center justify-end gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Metric Card Component
 * Conforms to AUTHORITATIVE_FOUNDATION_v1.1.md §9.3
 */
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
}

export function MetricCard({
  title,
  value,
  subtext,
  icon,
  loading = false,
  disabled = false,
  error,
  className = '',
  ...props
}: MetricCardProps) {
  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label={`Loading metric: ${title}`}
        className={`rounded-xl border border-border bg-surface p-6 shadow-xs animate-pulse ${className}`}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-surface-tertiary" />
          <div className="h-8 w-8 rounded-md bg-surface-secondary" />
        </div>
        <div className="h-8 w-16 rounded bg-surface-secondary mt-4" />
        <div className="h-3 w-32 rounded bg-surface-tertiary mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-xl border border-border bg-surface p-6 shadow-xs text-left transition-all
        ${disabled ? 'opacity-60 bg-surface-secondary/40' : ''}
        ${error ? 'border-status-cancelled-border' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-md bg-surface-secondary text-text-secondary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {error ? (
        <div className="mt-2 text-xs text-status-cancelled-text font-medium">{error}</div>
      ) : (
        <div className="text-3xl font-bold text-text-primary tracking-tight mt-1">
          {value}
        </div>
      )}

      {subtext && !error && (
        <div className="text-xs text-text-muted mt-2">{subtext}</div>
      )}
    </div>
  );
}
