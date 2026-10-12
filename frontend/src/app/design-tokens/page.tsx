import Link from 'next/link';

export default function DesignTokensBenchPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Block */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-xs">
          <div className="inline-flex items-center gap-2 rounded-sm bg-primary-subtle px-3 py-1 text-xs font-medium text-primary mb-3">
            <span className="h-2 w-2 rounded-full bg-primary" />
            BookFlow MVP — Ticket T-06 Foundation
          </div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
            Next.js App Router &amp; Design System Tokens
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Empirical verification test bench for frozen design tokens per AUTHORITATIVE_FOUNDATION_v1.1.md.
          </p>

          {/* Navigation */}
          <div className="mt-4 pt-4 border-t border-surface-tertiary">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2.5">
              Available Views
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                href="/"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-tertiary font-medium text-text-primary transition-colors min-h-[44px]"
              >
                <span>(public) / (Landing Page)</span>
                <span className="text-primary font-bold">→</span>
              </Link>
              <Link
                href="/components-gallery"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-tertiary font-medium text-text-primary transition-colors min-h-[44px]"
              >
                <span>Component Gallery (All States)</span>
                <span className="text-primary font-bold">→</span>
              </Link>
              <Link
                href="/b/apex-barber"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-tertiary font-medium text-text-primary transition-colors min-h-[44px]"
              >
                <span>(public) /b/[slug]</span>
                <span className="text-primary font-bold">→</span>
              </Link>
              <Link
                href="/portal"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-tertiary font-medium text-text-primary transition-colors min-h-[44px]"
              >
                <span>(owner) /portal</span>
                <span className="text-primary font-bold">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. Core Brand Color Swatches */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-xs">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4">
            Core Brand Tokens (§5)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-primary mb-2" />
              <div className="font-medium text-text-primary">Primary</div>
              <div className="text-text-muted text-[11px]">#2563EB</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-primary-hover mb-2" />
              <div className="font-medium text-text-primary">Primary Hover</div>
              <div className="text-text-muted text-[11px]">#1D4ED8</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-primary-subtle border border-primary/20 mb-2" />
              <div className="font-medium text-text-primary">Primary Subtle</div>
              <div className="text-text-muted text-[11px]">#EFF6FF</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-secondary-accent mb-2" />
              <div className="font-medium text-text-primary">Teal Accent</div>
              <div className="text-text-muted text-[11px]">#0D9488</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-secondary-hover mb-2" />
              <div className="font-medium text-text-primary">Teal Hover</div>
              <div className="text-text-muted text-[11px]">#0F766E</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-background border border-border mb-2" />
              <div className="font-medium text-text-primary">Background</div>
              <div className="text-text-muted text-[11px]">#F8FAFC</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-surface-secondary mb-2" />
              <div className="font-medium text-text-primary">Surface Secondary</div>
              <div className="text-text-muted text-[11px]">#F1F5F9</div>
            </div>
            <div className="rounded-lg border border-border p-3 bg-surface">
              <div className="h-8 rounded-md bg-surface-tertiary mb-2" />
              <div className="font-medium text-text-primary">Surface Tertiary</div>
              <div className="text-text-muted text-[11px]">#E2E8F0</div>
            </div>
          </div>
        </section>

        {/* 2. Semantic Status System */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-xs">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4">
            Semantic Status System (§6 — Appointment Lifecycles Only)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between rounded-sm bg-status-pending-bg text-status-pending-text border border-status-pending-border px-3.5 py-2.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-pending" />
                <span>Pending</span>
              </div>
              <span className="text-[11px] opacity-75">#B45309 / #FEF3C7</span>
            </div>
            <div className="flex items-center justify-between rounded-sm bg-status-confirmed-bg text-status-confirmed-text border border-status-confirmed-border px-3.5 py-2.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-confirmed" />
                <span>Confirmed</span>
              </div>
              <span className="text-[11px] opacity-75">#0369A1 / #E0F2FE</span>
            </div>
            <div className="flex items-center justify-between rounded-sm bg-status-completed-bg text-status-completed-text border border-status-completed-border px-3.5 py-2.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-completed" />
                <span>Completed</span>
              </div>
              <span className="text-[11px] opacity-75">#047857 / #D1FAE5</span>
            </div>
            <div className="flex items-center justify-between rounded-sm bg-status-cancelled-bg text-status-cancelled-text border border-status-cancelled-border px-3.5 py-2.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-status-cancelled" />
                <span>Cancelled</span>
              </div>
              <span className="text-[11px] opacity-75">#BE123C / #FFE4E6</span>
            </div>
          </div>
        </section>

        {/* 3. Typography Hierarchy */}
        <section className="rounded-xl border border-border bg-surface p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Typography Scale (§7 — Inter Sans-Serif)
          </h2>
          <div className="space-y-2 border-t border-surface-tertiary pt-3">
            <div className="text-3xl font-semibold text-text-primary">
              Display / Hero — 32px (600)
            </div>
            <div className="text-2xl font-semibold text-text-primary">
              Page Heading — 24px (600)
            </div>
            <div className="text-lg font-semibold text-text-primary">
              Section Heading — 18px (600)
            </div>
            <div className="text-base font-medium text-text-primary">
              Card Heading — 16px (500)
            </div>
            <div className="text-2xl font-bold text-text-primary">
              Metric Value: 48 (700)
            </div>
            <div className="text-sm font-normal text-text-secondary">
              Body Primary: 14px regular for standard data and form fields.
            </div>
            <div className="text-xs font-normal text-text-muted">
              Body Secondary: 13px regular for helper copy and timestamps.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
