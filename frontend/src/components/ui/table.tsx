'use client';

import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
  skeletonCols?: number;
}

export function Table({
  loading = false,
  disabled = false,
  error,
  empty = false,
  emptyMessage = 'No records found',
  skeletonRows = 4,
  skeletonCols = 4,
  className = '',
  children,
  ...props
}: TableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
      {error && (
        <div className="p-4 bg-status-cancelled-bg border-b border-status-cancelled-border text-xs text-status-cancelled-text flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table
          className={`w-full text-left border-collapse text-sm text-text-secondary ${
            disabled ? 'opacity-60 pointer-events-none' : ''
          } ${className}`}
          {...props}
        >
          {loading ? (
            <tbody className="divide-y divide-surface-tertiary animate-pulse">
              {Array.from({ length: skeletonRows }).map((_, rIdx) => (
                <tr key={rIdx} className="bg-surface">
                  {Array.from({ length: skeletonCols }).map((_, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4">
                      <div className="h-4 bg-surface-secondary rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : empty ? (
            <tbody>
              <tr>
                <td colSpan={100} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center text-text-muted">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-text-primary">{emptyMessage}</div>
                    <div className="text-xs text-text-muted">New entries will appear here as activity occurs.</div>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            children
          )}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`bg-surface-secondary border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wider select-none ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-surface-tertiary bg-surface ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`hover:bg-surface-secondary/75 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className = '',
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`py-3 px-4 font-semibold text-text-secondary text-left ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  className = '',
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`py-3.5 px-4 text-sm text-text-secondary align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}
