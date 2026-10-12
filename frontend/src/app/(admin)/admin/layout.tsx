'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Admin Dashboard',
      href: '/admin',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      label: 'Businesses Directory',
      href: '/admin/businesses',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Platform Analytics',
      href: '/admin/analytics',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Admin Security',
      href: '/admin/account',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dedicated Administrator Sidebar Navigation Shell */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white
          flex flex-col justify-between transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Admin Header */}
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
                PA
              </div>
              <div>
                <div className="font-bold text-sm text-white tracking-tight leading-tight">
                  BookFlow
                </div>
                <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  Platform Admin
                </div>
              </div>
            </div>

            {/* Close Button on Mobile Drawer (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close admin menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* System Status Strip */}
          <div className="p-3.5 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-300">System Health</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Operational
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Total Businesses: <strong className="text-white font-semibold">128</strong>
            </div>
          </div>

          {/* Admin Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors select-none
                    min-h-[44px]
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Session Identity Footer */}
          <div className="p-4 border-t border-slate-800 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-semibold text-xs">
                  AD
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">
                    Platform Admin
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    admin@bookflow.platform
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] sm:min-h-8 sm:min-w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Sign out administrator"
                aria-label="Sign out administrator"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-surface/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger on Mobile/Tablet (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary shadow-xs"
              aria-label="Open platform administration navigation"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <div className="text-sm font-semibold text-text-primary">
                Platform Administration
              </div>
              <div className="text-[11px] text-text-muted hidden sm:block">
                System Oversight &amp; Multi-Tenant Aggregate Telemetry
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center rounded-full bg-slate-900 text-white px-2.5 py-1 text-xs font-medium">
              Administrator Oversight
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
              ADM
            </div>
          </div>
        </header>

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
