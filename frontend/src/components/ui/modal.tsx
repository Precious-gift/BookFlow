'use client';

import React, { useEffect, useId, useCallback } from 'react';
import { Button } from './button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: 'primary' | 'destructive';
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  loading = false,
  disabled = false,
  error,
  maxWidth = 'md',
}: ModalProps) {
  const titleId = useId();
  const descId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading && !disabled) {
        onClose();
      }
    },
    [onClose, loading, disabled]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading && !disabled) {
          onClose();
        }
      }}
    >
      <div
        className={`
          relative w-full ${maxWidthClasses[maxWidth]} rounded-xl border border-border bg-surface p-6 shadow-xl
          animate-in zoom-in-95 duration-200 text-left
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-surface-tertiary">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-text-primary tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-xs text-text-secondary mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading || disabled}
            aria-label="Close dialog"
            className="
              min-h-[44px] min-w-[44px] sm:min-h-9 sm:min-w-9 -mr-2 -mt-2
              flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
              />
            </svg>
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mt-4 rounded-lg bg-status-cancelled-bg border border-status-cancelled-border p-3 text-xs text-status-cancelled-text flex items-start gap-2">
            <svg
              className="h-4 w-4 shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div className="font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Content Body */}
        <div className="py-4 text-sm text-text-secondary">{children}</div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-tertiary flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
          {footer ? (
            footer
          ) : (
            <>
              {cancelLabel && (
                <Button
                  variant="secondary"
                  size="md"
                  disabled={loading || disabled}
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  {cancelLabel}
                </Button>
              )}
              {confirmLabel && (
                <Button
                  variant={confirmVariant}
                  size="md"
                  loading={loading}
                  disabled={disabled}
                  onClick={onConfirm}
                  className="w-full sm:w-auto"
                >
                  {confirmLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
