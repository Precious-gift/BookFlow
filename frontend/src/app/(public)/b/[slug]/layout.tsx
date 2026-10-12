import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment | BookFlow',
  description: 'Book an appointment with an independent service provider on BookFlow.',
};

export default function PublicBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* 1. Public Guest Header (Isolated Boundary - Zero Owner/Admin Controls) */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-xs">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-xs select-none">
              BF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-text-primary tracking-tight">
                  BookFlow
                </span>
                <span className="inline-flex items-center rounded-sm bg-primary-subtle px-1.5 py-0.5 text-[11px] font-medium text-primary">
                  Guest Booking
                </span>
              </div>
              <p className="text-[11px] text-text-muted hidden sm:block">
                Accountless, instant appointment scheduling
              </p>
            </div>
          </div>

          {/* Trust Affordance */}
          <div className="flex items-center gap-1.5 text-xs text-secondary-accent font-medium bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100">
            <svg
              className="h-3.5 w-3.5 text-secondary-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden xs:inline">Secure Direct Booking</span>
          </div>
        </div>
      </header>

      {/* 2. Main Centered Booking Container (Capped at 896px / 56rem per §11) */}
      <main className="flex-1 w-full mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* 3. Reassuring Accountless Footer */}
      <footer className="border-t border-border bg-surface py-6 text-center text-xs text-text-muted">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Powered by <strong className="font-semibold text-text-secondary">BookFlow</strong> • Solo-Operator Scheduling
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-text-secondary cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:text-text-secondary cursor-pointer">Guest Terms</span>
            <span>•</span>
            <span className="hover:text-text-secondary cursor-pointer">Direct Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
