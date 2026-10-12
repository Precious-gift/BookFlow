'use client';

import React, { forwardRef, useId } from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  optional?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      optional = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled = false,
      id,
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const isDisabled = disabled || loading;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-medium text-text-secondary select-none"
            >
              {label}
              {required && <span className="text-status-cancelled-text ml-1" aria-hidden="true">*</span>}
            </label>
            {optional && !required && (
              <span className="text-[11px] text-text-muted italic select-none">
                (optional)
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={isDisabled}
            aria-invalid={hasError ? 'true' : undefined}
            aria-required={required ? 'true' : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full rounded-lg text-sm text-text-primary transition-all
              min-h-[44px] sm:min-h-10 h-10 px-3 py-2
              placeholder:text-text-muted
              border
              ${leftIcon ? 'pl-9' : ''}
              ${rightIcon || loading ? 'pr-9' : ''}
              ${
                hasError
                  ? 'border-status-cancelled-border bg-surface text-text-primary focus:border-status-cancelled focus:ring-2 focus:ring-status-cancelled/20 focus:outline-none'
                  : 'border-border bg-surface hover:border-border-hover focus:border-border-focus focus:ring-2 focus:ring-primary/15 focus:outline-none'
              }
              ${
                isDisabled
                  ? 'bg-surface-secondary text-text-muted cursor-not-allowed border-border hover:border-border'
                  : ''
              }
              ${className}
            `}
            {...props}
          />

          {loading ? (
            <div className="absolute right-3 text-primary flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading input content"
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
            </div>
          ) : (
            rightIcon && (
              <div className="absolute right-3 text-text-muted pointer-events-none flex items-center justify-center">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {hasError && errorMessage && (
          <p id={errorId} className="text-xs text-status-cancelled-text font-normal flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-text-muted font-normal">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
