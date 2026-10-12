'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function OwnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/portal',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Appointments',
      href: '/portal/appointments',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Services',
      href: '/portal/services',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      label: 'Availability',
      href: '/portal/availability',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Customers (CRM)',
      href: '/portal/customers',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      label: 'Business Profile',
      href: '/portal/profile',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Account & Security',
      href: '/portal/account',
      icon: (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile / Tablet Drawer Scrim */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 1. Dedicated Owner Sidebar Navigation Shell */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border
          flex flex-col justify-between transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand & Workspace Header */}
          <div className="h-16 px-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
                BF
              </div>
              <div>
                <div className="font-bold text-sm text-text-primary tracking-tight leading-tight">
                  BookFlow
                </div>
                <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Owner Portal
                </div>
              </div>
            </div>

            {/* Close Button on Mobile Drawer (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary"
              aria-label="Close navigation menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Business Info Strip */}
          <div className="p-4 mx-3 my-3 rounded-lg bg-surface-secondary border border-border">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-secondary-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
                AP
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-text-primary truncate">
                  Apex Barber Studio
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Accepting Bookings</span>
                </div>
              </div>
            </div>
            <Link
              href="/b/apex-barber"
              target="_blank"
              className="mt-2.5 inline-flex items-center justify-center w-full min-h-[36px] text-xs font-medium text-primary hover:text-primary-hover bg-surface hover:bg-primary-subtle border border-border rounded-md px-2.5 py-1.5 transition-colors gap-1.5"
            >
              <span>Preview Public Link</span>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </Link>
          </div>

          {/* Navigation Links List */}
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
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-text-muted'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer: Solo Operator Identity */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-surface-tertiary flex items-center justify-center text-text-primary font-medium text-xs">
                  JD
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-text-primary truncate">
                    John Doe (Owner)
                  </div>
                  <div className="text-[11px] text-text-muted truncate">
                    john@apexbarber.com
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] sm:min-h-8 sm:min-w-8 flex items-center justify-center rounded-md text-text-muted hover:text-status-cancelled-text hover:bg-rose-50 transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-surface/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger on Mobile/Tablet (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary shadow-xs"
              aria-label="Open portal navigation"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <div className="text-sm font-semibold text-text-primary">
                Solo Operator Dashboard
              </div>
              <div className="text-[11px] text-text-muted hidden sm:block">
                Partitioned Single-Operator Tenant Boundary
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center rounded-full bg-primary-subtle px-2.5 py-1 text-xs font-medium text-primary">
              Owner Boundary Protected
            </span>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              AP
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
