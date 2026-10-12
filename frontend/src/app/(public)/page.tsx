'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PublicMarketingLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary-subtle selection:text-primary">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & BRAND ENTRY POINTS (PUB-01)
          Strict boundary: Zero authenticated navigation items appear here.
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            aria-label="BookFlow Home"
          >
            <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs select-none group-hover:bg-primary-hover transition-colors">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              BookFlow
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-8"
          >
            <a
              href="#features"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            >
              How It Works
            </a>
            <a
              href="#for-businesses"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            >
              For Businesses
            </a>
          </nav>

          {/* Header Action Entry Points */}
          <div className="flex items-center gap-3">
            {/* Desktop CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                id="header-cta-login"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                id="header-cta-register"
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover active:bg-blue-800 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger Menu Toggle (Touch Target >= 44px) */}
            <button
              type="button"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden border-t border-border bg-surface px-4 py-6 shadow-lg animate-in slide-in-from-top-2"
          >
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3 rounded-lg text-base font-medium text-text-primary hover:bg-surface-secondary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3 rounded-lg text-base font-medium text-text-primary hover:bg-surface-secondary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#for-businesses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-3 rounded-lg text-base font-medium text-text-primary hover:bg-surface-secondary transition-colors"
              >
                For Businesses
              </a>

              {/* Mobile CTAs for Smallest Screens (<640px) */}
              <div className="pt-4 border-t border-surface-tertiary flex flex-col sm:hidden space-y-2.5">
                <Link
                  href="/login"
                  id="mobile-drawer-cta-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] w-full rounded-lg text-sm font-medium text-text-primary bg-surface-secondary hover:bg-surface-tertiary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  id="mobile-drawer-cta-register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] w-full rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover active:bg-blue-800 transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 w-full">
        {/* ─────────────────────────────────────────────────────────────
            2. HERO SECTION
            Visual reference: ui-ux/screens/exports/bookflow_public_landing_page
            ───────────────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-background pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold mb-6 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-secondary-accent animate-pulse" />
              <span>SaaS for Single-Operator Businesses</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight max-w-4xl mb-6 leading-[1.15]">
              Simple Booking and Customer Management for Your Business
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mb-8 sm:mb-10 leading-relaxed">
              BookFlow gives independent service businesses a simple way to manage appointments, services, working hours, and customer relationships from one place.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-12 sm:mb-16">
              <Link
                href="/register"
                id="hero-cta-register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg text-sm sm:text-base font-medium text-white bg-primary hover:bg-primary-hover active:bg-blue-800 transition-colors shadow-xs group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span>Get Started</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                id="hero-cta-login"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg text-sm sm:text-base font-medium text-text-primary bg-surface hover:bg-surface-secondary active:bg-surface-tertiary border border-border transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Sign In
              </Link>
            </div>

            {/* SaaS Product UI Preview Frame (Mock Browser Window) */}
            <div className="w-full max-w-5xl rounded-xl border border-border bg-surface shadow-xl overflow-hidden text-left mx-auto">
              {/* Window Chrome Title Bar */}
              <div className="h-10 bg-surface-secondary border-b border-border px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-md text-xs text-text-secondary shadow-xs justify-center w-64 sm:w-80">
                  <svg
                    className="w-3.5 h-3.5 text-secondary-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-mono text-[11px] sm:text-xs">bookflow.app/owner/dashboard</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Dashboard Content Mock */}
              <div className="p-4 sm:p-6 lg:p-8 bg-surface space-y-6">
                {/* Top Bar Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      VS
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary text-base">Vance Studio</div>
                      <p className="text-xs text-text-secondary">Marcus Vance • Solo Owner Workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-secondary bg-surface-secondary border border-border px-3 py-1.5 rounded-md">
                      Today: Thursday, Oct 24
                    </span>
                  </div>
                </div>

                {/* 4 Metric KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
                    <div className="flex items-center justify-between text-text-secondary mb-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">Today&apos;s Appointments</span>
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-text-primary">6</div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
                    <div className="flex items-center justify-between text-text-secondary mb-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">Upcoming Bookings</span>
                      <svg className="w-4 h-4 text-secondary-accent" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-text-primary">18</div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
                    <div className="flex items-center justify-between text-text-secondary mb-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">Active Customers</span>
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-text-primary">42</div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
                    <div className="flex items-center justify-between text-text-secondary mb-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">Completed Services</span>
                      <svg className="w-4 h-4 text-secondary-accent" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-text-primary">124</div>
                  </div>
                </div>

                {/* Today's Agenda Card */}
                <div className="rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold text-text-primary">Today&apos;s Agenda</h2>
                      <p className="text-xs text-text-secondary">Scheduled bookings and live customer requests</p>
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary-subtle border border-primary/20 px-2.5 py-1 rounded-full">
                      Live Schedule
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1: Confirmed */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-surface gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="text-sm font-bold text-primary font-mono w-20">09:00 AM</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-text-primary">Elena Rostova</span>
                            <span className="inline-flex items-center gap-1 rounded-sm bg-status-confirmed-bg text-status-confirmed-text border border-status-confirmed-border px-2 py-0.5 text-[11px] font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-status-confirmed" />
                              Confirmed
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary">Signature Haircut • 45 mins</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                        <span className="px-2.5 py-1 rounded bg-surface-secondary text-text-secondary border border-border font-medium">Complete</span>
                        <span className="px-2.5 py-1 rounded bg-surface-secondary text-text-secondary border border-border font-medium">Reschedule</span>
                        <span className="px-2.5 py-1 rounded bg-status-cancelled-bg text-status-cancelled-text border border-status-cancelled-border font-medium">Cancel</span>
                      </div>
                    </div>

                    {/* Item 2: Pending Request */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-surface gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="text-sm font-bold text-primary font-mono w-20">10:30 AM</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-text-primary">David Chen</span>
                            <span className="inline-flex items-center gap-1 rounded-sm bg-status-pending-bg text-status-pending-text border border-status-pending-border px-2 py-0.5 text-[11px] font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-status-pending" />
                              Pending
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary">Beard Styling • 30 mins • (415) 890-1284</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                        <span className="px-2.5 py-1 rounded bg-primary text-white font-medium">Confirm</span>
                        <span className="px-2.5 py-1 rounded bg-surface-secondary text-text-secondary border border-border font-medium">Reschedule</span>
                        <span className="px-2.5 py-1 rounded bg-status-cancelled-bg text-status-cancelled-text border border-status-cancelled-border font-medium">Decline</span>
                      </div>
                    </div>

                    {/* Item 3: Completed */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-surface/60 opacity-80 gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="text-sm font-medium text-text-muted font-mono w-20 line-through">08:00 AM</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-text-secondary">Sarah Morales</span>
                            <span className="inline-flex items-center gap-1 rounded-sm bg-status-completed-bg text-status-completed-text border border-status-completed-border px-2 py-0.5 text-[11px] font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-status-completed" />
                              Completed
                            </span>
                          </div>
                          <p className="text-xs text-text-muted">Consultation • 30 mins</p>
                        </div>
                      </div>
                      <div className="text-xs text-text-muted">
                        Finished at 8:30 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. VALUE PROPOSITION STRIP (4 BENEFIT CARDS)
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full bg-surface-secondary py-12 sm:py-16 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Benefit 1 */}
              <div className="p-6 rounded-xl border border-border bg-surface shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-text-primary">Simple Appointment Booking</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Effortless agenda overview and conflict-free booking requests tailored specifically for your operational hours.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="p-6 rounded-xl border border-border bg-surface shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.059 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-text-primary">No Customer Account Required</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Frictionless guest booking with zero passwords, mandatory app downloads, or complex signups for your clients.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="p-6 rounded-xl border border-border bg-surface shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-text-primary">Customer Management</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Auto-generated customer profiles with contact info, complete appointment history, and private internal notes.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="p-6 rounded-xl border border-border bg-surface shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-text-primary">Availability Control</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Define recurring weekly operating hours and block custom out-of-office periods in seconds without overlaps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. CORE PLATFORM FEATURES SECTION (2x2 GRID)
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full bg-background py-16 sm:py-20 lg:py-24" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 sm:mb-16">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Core Platform Features
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mt-2 mb-4">
                Designed for the Reality of Solo Service Businesses
              </h2>
              <p className="text-base sm:text-lg text-text-secondary">
                Everything you need to run your schedule without bloat, multi-staff confusion, or complicated setups.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Feature 1: Appointment Management */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Appointment Management</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Review, confirm, complete, reschedule, and cancel appointments from one organized owner workspace. Stay informed without checking multiple places.
                  </p>
                </div>
                {/* Mini UI Preview */}
                <div className="p-3.5 rounded-lg border border-border bg-surface-secondary/50 space-y-2">
                  <div className="flex items-center justify-between bg-surface p-2.5 rounded-md border border-border shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-medium text-text-primary">Alex Rivera • 11:00 AM</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-status-confirmed-bg text-status-confirmed-text border border-status-confirmed-border">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-2.5 rounded-md border border-border shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-status-pending" />
                      <span className="text-xs font-medium text-text-primary">Samantha Reed • 01:30 PM</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-status-pending-bg text-status-pending-text border border-status-pending-border">
                      Pending Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Service Management */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Service Management</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Create and manage services with descriptions, precise duration, pricing, and active/inactive availability toggles.
                  </p>
                </div>
                {/* Mini UI Preview */}
                <div className="p-3.5 rounded-lg border border-border bg-surface-secondary/50 space-y-2">
                  <div className="flex items-center justify-between bg-surface p-2.5 rounded-md border border-border shadow-xs">
                    <div>
                      <span className="text-xs font-semibold text-text-primary block">Standard Haircut</span>
                      <span className="text-[11px] text-text-secondary">45 min • $45</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-2.5 rounded-md border border-border shadow-xs">
                    <div>
                      <span className="text-xs font-semibold text-text-primary block">Beard Sculpt &amp; Trim</span>
                      <span className="text-[11px] text-text-secondary">30 min • $30</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Availability Control */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Availability Control</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Define weekly working hours and block unavailable periods when the business is closed, giving you absolute control over your personal time.
                  </p>
                </div>
                {/* Mini UI Preview */}
                <div className="p-3 sm:p-3.5 rounded-lg border border-border bg-surface-secondary/50">
                  <div className="grid grid-cols-5 gap-1 sm:gap-1.5 text-center">
                    <div className="py-2 px-1 sm:p-2 rounded bg-surface border border-border shadow-xs">
                      <span className="text-xs font-medium text-text-secondary block">Mon</span>
                      <span className="text-[10px] sm:text-[11px] text-primary font-semibold inline-block">9 - 5</span>
                    </div>
                    <div className="py-2 px-1 sm:p-2 rounded bg-surface border border-border shadow-xs">
                      <span className="text-xs font-medium text-text-secondary block">Tue</span>
                      <span className="text-[10px] sm:text-[11px] text-primary font-semibold inline-block">9 - 5</span>
                    </div>
                    <div className="py-2 px-1 sm:p-2 rounded bg-surface border border-border shadow-xs">
                      <span className="text-xs font-medium text-text-secondary block">Wed</span>
                      <span className="text-[10px] sm:text-[11px] text-primary font-semibold inline-block">9 - 5</span>
                    </div>
                    <div className="py-2 px-1 sm:p-2 rounded bg-surface border border-border shadow-xs">
                      <span className="text-xs font-medium text-text-secondary block">Thu</span>
                      <span className="text-[10px] sm:text-[11px] text-primary font-semibold inline-block">9 - 5</span>
                    </div>
                    <div className="py-2 px-1 sm:p-2 rounded bg-status-cancelled-bg/40 border border-status-cancelled-border">
                      <span className="text-xs font-medium text-status-cancelled-text block">Fri</span>
                      <span className="text-[10px] sm:text-[11px] text-status-cancelled-text font-semibold tracking-tight inline-block">Blocked</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 4: Customer CRM */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Customer CRM</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    Automatically build customer records from bookings and keep contact information, internal notes, and appointment history organized.
                  </p>
                </div>
                {/* Mini UI Preview */}
                <div className="p-3.5 rounded-lg border border-border bg-surface-secondary/50 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">John Doe</span>
                      <span className="text-[11px] bg-surface px-2 py-0.5 rounded border border-border text-text-secondary">
                        5 visits
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate">john@example.com • (555) 234-5678</p>
                    <div className="mt-2 text-[11px] bg-surface p-2 rounded border border-border text-text-secondary italic">
                      &ldquo;Prefers scissors only, sensitive scalp.&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. "HOW IT WORKS" 3-STEP VISUAL GUIDE
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full bg-surface-secondary py-16 sm:py-20 border-y border-border" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Simple 3-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mt-2 mb-4">
                How BookFlow Works for Your Business
              </h2>
              <p className="text-base sm:text-lg text-text-secondary">
                From setting up your schedule to receiving confirmed client appointments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary/20 select-none">01</span>
                    <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">Set Up Your Business</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Create your business profile, define your service menu, and establish weekly working hours in your private owner portal.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-secondary-accent flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-secondary-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Takes under 5 minutes
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary/20 select-none">02</span>
                    <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">Share Your Booking Page</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Customers visit your public BookFlow booking page and select a service, date, and available time without creating accounts.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-secondary-accent flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-secondary-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Clean public URL
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary/20 select-none">03</span>
                    <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">Manage Your Appointments</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Review booking requests, confirm appointments, manage your schedule, and maintain full customer relationship history.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-secondary-accent flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-secondary-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Direct schedule oversight
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. CUSTOMER GUEST BOOKING EXPERIENCE PREVIEW
            Demonstrates the frictionless guest journey per MVTS v1.1 §2 Actor 2
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full bg-background py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Frictionless Guest Experience
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mt-2 mb-4">
                Make Booking Easy for Your Customers
              </h2>
              <p className="text-base sm:text-lg text-text-secondary">
                Frictionless guest booking that respects your clients&apos; time. No customer account, password, or login required.
              </p>
            </div>

            {/* Linear Stepper Diagram */}
            <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs mb-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                    1
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">Choose Service</span>
                  <span className="text-[11px] text-text-secondary mt-0.5">Duration &amp; pricing</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                    2
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">Choose Date</span>
                  <span className="text-[11px] text-text-secondary mt-0.5">Real-time availability</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                    3
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">Choose Time</span>
                  <span className="text-[11px] text-text-secondary mt-0.5">Open calendar slots</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                    4
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">Contact Details</span>
                  <span className="text-[11px] text-text-secondary mt-0.5">Strictly 3 fields</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                    5
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">Review</span>
                  <span className="text-[11px] text-text-secondary mt-0.5">Verify booking info</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">Submitted</span>
                  <span className="text-[11px] text-text-secondary mt-0.5">Pending owner review</span>
                </div>
              </div>
            </div>

            {/* Strict 3-Field Guest Information Callout Card */}
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-xl border border-border bg-surface-secondary/40 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Frictionless Guest Information</h3>
                  <p className="text-xs text-text-secondary">Clients provide only what you need to render the service per MVTS v1.1.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-surface rounded-lg border border-border shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary text-sm">1.</span>
                    <span className="text-sm font-medium text-text-primary">Full Name</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-subtle text-primary border border-primary/20">
                    Required (*)
                  </span>
                </div>

                <div className="p-3 bg-surface rounded-lg border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary text-sm">2.</span>
                    <div>
                      <span className="text-sm font-medium text-text-primary">Phone Number</span>
                      <span className="block text-xs text-text-secondary">Required customer contact information</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-subtle text-primary border border-primary/20 self-start sm:self-auto">
                    Required (*)
                  </span>
                </div>

                <div className="p-3 bg-surface rounded-lg border border-border shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-text-muted text-sm">3.</span>
                    <span className="text-sm font-medium text-text-primary">Email Address</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border">
                    Optional
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-text-secondary text-xs justify-center text-center">
                <svg className="w-4 h-4 text-secondary-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                <span>Accountless guest booking. Requests submit instantly in pending status for owner review. No password or login required.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. BUSINESS OWNER EXPERIENCE SECTION (OWNER PORTAL MOCK)
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full bg-surface-secondary py-16 sm:py-20 border-y border-border" id="for-businesses">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Feature Highlights */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Owner Portal
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mt-2 mb-4">
                    A Complete Workspace Built Exclusively for Solo Operators
                  </h2>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                    No complicated multi-staff matrices or unnecessary clutter. Just a clean, fast desktop SaaS portal where you control your entire business day.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">Unified appointment overview with status controls</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">Custom services catalog with duration and pricing</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">Weekly working hours &amp; blocked unavailable periods</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">Automatic customer directory with appointment visit counts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">Private internal notes for each client relationship</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-primary">Core business metrics &amp; live schedule visibility</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity Desktop SaaS View Mock */}
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-border bg-surface shadow-xl overflow-hidden">
                  <div className="h-11 bg-surface-secondary border-b border-border px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">BookFlow Workspace</span>
                    </div>
                    <span className="text-[11px] bg-surface px-2.5 py-0.5 rounded border border-border text-text-secondary font-medium">
                      Owner Workspace
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row h-auto sm:h-96">
                    {/* Mock Sidebar */}
                    <div className="w-full sm:w-48 bg-surface-secondary/40 border-b sm:border-b-0 sm:border-r border-border p-3 flex flex-col justify-between shrink-0">
                      <div className="space-y-1">
                        <div className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          <span>Appointments</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-md text-text-secondary text-xs font-medium flex items-center gap-2 hover:bg-surface-secondary">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Services</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-md text-text-secondary text-xs font-medium flex items-center gap-2 hover:bg-surface-secondary">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Hours</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-md text-text-secondary text-xs font-medium flex items-center gap-2 hover:bg-surface-secondary">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                          <span>Customers</span>
                        </div>
                      </div>
                      <div className="pt-2 text-[11px] text-text-muted border-t border-border">
                        <span className="font-semibold text-text-primary block">Vance Studio</span>
                        <span>Single-Operator</span>
                      </div>
                    </div>

                    {/* Main Detail Pane */}
                    <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">Customer Detail</h4>
                          <p className="text-[11px] text-text-secondary">Profile created from booking</p>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary-subtle text-primary border border-primary/20">
                          Active Client
                        </span>
                      </div>

                      {/* Customer Details info */}
                      <div className="p-3 rounded-lg border border-border bg-surface-secondary/40 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-text-muted block text-[11px]">Client Name:</span>
                            <span className="font-semibold text-text-primary">Marcus Holloway</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[11px]">Phone:</span>
                            <span className="font-semibold text-text-primary">(415) 555-0199</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[11px]">Total Appointments:</span>
                            <span className="font-semibold text-text-primary">4 Visits</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[11px]">Status:</span>
                            <span className="font-semibold text-secondary-accent">In Good Standing</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <span className="font-medium text-text-primary block mb-1 text-[11px]">Private Owner Notes:</span>
                          <div className="p-2 rounded bg-surface border border-border text-[11px] text-text-secondary">
                            Prefers afternoon appointments on Tuesdays. Standard fade clipper guard #2.
                          </div>
                        </div>
                      </div>

                      {/* Past Appointment Log */}
                      <div>
                        <span className="text-xs font-semibold text-text-primary block mb-1.5">Appointment History</span>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="p-2 rounded bg-surface border border-border flex justify-between items-center">
                            <span className="text-text-primary">Oct 12 • Haircut • 45m</span>
                            <span className="text-secondary-accent font-semibold">Completed</span>
                          </div>
                          <div className="p-2 rounded bg-surface border border-border flex justify-between items-center">
                            <span className="text-text-primary">Sep 18 • Beard Sculpt • 30m</span>
                            <span className="text-secondary-accent font-semibold">Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. CALL TO ACTION CONVERSION BANNER
            Dual CTAs leading to /register and /login
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full bg-background py-16 sm:py-20 lg:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 lg:p-14 rounded-2xl border border-border bg-surface shadow-md text-center flex flex-col items-center">
              {/* Reassurance Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-secondary border border-border text-text-secondary text-xs font-medium mb-6 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-accent" />
                <span>Built for independent service businesses • No complex setup</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight max-w-2xl mb-4">
                Ready to simplify your bookings?
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
                Manage appointments, services, availability, and customer relationships in one simple workspace.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  href="/register"
                  id="banner-cta-register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-3 rounded-lg text-sm sm:text-base font-medium text-white bg-primary hover:bg-primary-hover active:bg-blue-800 transition-colors shadow-xs group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <span>Get Started</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  id="banner-cta-login"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-8 py-3 rounded-lg text-sm sm:text-base font-medium text-text-primary bg-surface hover:bg-surface-secondary active:bg-surface-tertiary border border-border transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          9. FOOTER (Zero authenticated controls; clean brand links)
          ───────────────────────────────────────────────────────────── */}
      <footer className="w-full bg-surface border-t border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-border">
            {/* Column 1: Brand & Tagline */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg self-start"
                aria-label="BookFlow Home"
              >
                <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10" />
                    <path d="M6 10h10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-tight text-text-primary">
                  BookFlow
                </span>
              </Link>
              <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                A streamlined appointment booking and lightweight customer relationship management platform built for independent single-operator service businesses.
              </p>
            </div>

            {/* Column 2: Product */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">Product</span>
              <a href="#features" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-text-secondary hover:text-primary transition-colors">
                How It Works
              </a>
            </div>

            {/* Column 3: Business */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">Business</span>
              <a href="#for-businesses" className="text-sm text-text-secondary hover:text-primary transition-colors">
                For Businesses
              </a>
              <Link
                href="/b/apex-barber"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Booking Preview
              </Link>
            </div>

            {/* Column 4: Account / Brand Entry Points */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">Account</span>
              <Link
                href="/login"
                id="footer-link-login"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                id="footer-link-register"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Attribution */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <p>© 2025 BookFlow Technologies Inc. All rights reserved.</p>
            <p>Built with high precision for independent operators worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
