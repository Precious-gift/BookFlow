'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  InputField,
  TimeChip,
  StatusBadge,
  Modal,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  MetricCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

export default function ComponentsGalleryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<'normal' | 'loading' | 'disabled' | 'error'>('normal');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Block */}
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary-subtle px-3 py-1 text-xs font-medium text-primary mb-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Ticket T-07 Verification Suite
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Shared UI Component Library &amp; States
              </h1>
              <p className="mt-1 text-sm text-text-secondary max-w-2xl">
                Comprehensive empirical test bench validating all acceptance criteria: loading, disabled, and error states for each shared component, plus touch targets &gt;= 44px.
              </p>
            </div>

            {/* Quick Links to Route Group Layouts */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/b/apex-barber"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-surface border border-border hover:bg-surface-secondary text-text-primary min-h-[44px]"
              >
                <span>(public) /b/[slug]</span>
                <span className="text-primary font-bold">→</span>
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover min-h-[44px]"
              >
                <span>(owner) /portal</span>
                <span className="text-white font-bold">→</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 min-h-[44px]"
              >
                <span>(admin) /admin</span>
                <span className="text-white font-bold">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. BUTTON COMPONENT BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              1. Button Component (`Button`)
            </h2>
            <p className="text-xs text-text-secondary">
              Variants: Primary, Secondary, Destructive, Ghost. Sizing with mobile touch targets &gt;= 44px.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Normal State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Normal State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button variant="primary" fullWidth>Primary Button</Button>
                <Button variant="secondary" fullWidth>Secondary Button</Button>
                <Button variant="destructive" fullWidth>Destructive Button</Button>
                <Button variant="ghost" fullWidth>Ghost Button</Button>
              </CardContent>
            </Card>

            {/* Loading State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Loading State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button variant="primary" loading fullWidth>Saving...</Button>
                <Button variant="secondary" loading fullWidth>Loading...</Button>
                <Button variant="destructive" loading fullWidth>Deleting...</Button>
                <Button variant="ghost" loading fullWidth>Updating...</Button>
              </CardContent>
            </Card>

            {/* Disabled State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Disabled State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button variant="primary" disabled fullWidth>Disabled Primary</Button>
                <Button variant="secondary" disabled fullWidth>Disabled Secondary</Button>
                <Button variant="destructive" disabled fullWidth>Disabled Destructive</Button>
                <Button variant="ghost" disabled fullWidth>Disabled Ghost</Button>
              </CardContent>
            </Card>

            {/* Error State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Error State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button variant="primary" error fullWidth>Error State</Button>
                <Button variant="secondary" error fullWidth>Action Failed</Button>
                <Button variant="destructive" error fullWidth>Network Error</Button>
                <Button variant="ghost" error fullWidth>Validation Error</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. INPUTFIELD COMPONENT BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              2. InputField Component (`InputField`)
            </h2>
            <p className="text-xs text-text-secondary">
              Input control with label, required asterisk, optional badge, helper text, and error states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Default &amp; Required</CardTitle>
              </CardHeader>
              <CardContent>
                <InputField
                  label="Full Name"
                  required
                  placeholder="e.g. Alex Morgan"
                  helperText="Required contact info."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Optional &amp; Filled</CardTitle>
              </CardHeader>
              <CardContent>
                <InputField
                  label="Customer Email"
                  type="email"
                  optional
                  defaultValue="alex.morgan@example.com"
                  helperText="For booking confirmation receipt."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Loading State</CardTitle>
              </CardHeader>
              <CardContent>
                <InputField
                  label="Checking Availability"
                  loading
                  defaultValue="Validating slot..."
                  helperText="Verifying appointment lock."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Error &amp; Disabled</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InputField
                  label="Phone Number"
                  required
                  defaultValue="123"
                  error="Invalid phone format."
                />
                <InputField
                  label="System Read-only"
                  disabled
                  defaultValue="LOCKED-TENANT-ID"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. TIMECHIP COMPONENT BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              3. TimeChip Component (`TimeChip`)
            </h2>
            <p className="text-xs text-text-secondary">
              Time slot chips with touch targets &gt;= 44px. States: Available, Selected, Disabled, Loading, Error.
            </p>
          </div>

          <Card>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div>
                  <div className="text-xs text-text-muted mb-1.5 font-medium">Available (Normal)</div>
                  <TimeChip
                    time="09:00"
                    period="AM"
                    subtext="Available"
                    selected={selectedSlot === '09:00 AM'}
                    onClick={() => setSelectedSlot('09:00 AM')}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1.5 font-medium">Selected State</div>
                  <TimeChip
                    time="10:00"
                    period="AM"
                    subtext="Selected"
                    selected={selectedSlot === '10:00 AM'}
                    onClick={() => setSelectedSlot('10:00 AM')}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1.5 font-medium">Disabled / Booked</div>
                  <TimeChip
                    time="11:30"
                    period="AM"
                    subtext="Booked"
                    disabled
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1.5 font-medium">Loading State</div>
                  <TimeChip
                    time="01:15"
                    period="PM"
                    loading
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1.5 font-medium">Error State</div>
                  <TimeChip
                    time="02:00"
                    period="PM"
                    error
                    subtext="Conflict"
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. STATUS BADGE COMPONENT BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              4. StatusBadge Component (`StatusBadge`)
            </h2>
            <p className="text-xs text-text-secondary">
              Strict accessibility rule (§6): Text + Distinct Icon + Minimum 4.5:1 contrast across all lifecycle statuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Semantic Statuses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Pending:</span>
                  <StatusBadge status="Pending" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Confirmed:</span>
                  <StatusBadge status="Confirmed" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Completed:</span>
                  <StatusBadge status="Completed" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Cancelled:</span>
                  <StatusBadge status="Cancelled" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Loading State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Shimmer:</span>
                  <StatusBadge loading />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Small:</span>
                  <StatusBadge loading size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Large:</span>
                  <StatusBadge loading size="lg" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Disabled State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Subdued Pending:</span>
                  <StatusBadge status="Pending" disabled />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Subdued Confirmed:</span>
                  <StatusBadge status="Confirmed" disabled />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Subdued Completed:</span>
                  <StatusBadge status="Completed" disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Error State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Default:</span>
                  <StatusBadge error />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Custom Alert:</span>
                  <StatusBadge error label="Sync Failed" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Large Alert:</span>
                  <StatusBadge error label="Unverified" size="lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. MODAL DIALOG BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              5. Modal Component (`Modal`)
            </h2>
            <p className="text-xs text-text-secondary">
              Accessible dialog with backdrop blur, keyboard handling, touch-friendly close button, and states.
            </p>
          </div>

          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalVariant('normal');
                    setModalOpen(true);
                  }}
                >
                  Open Normal Modal
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setModalVariant('loading');
                    setModalOpen(true);
                  }}
                >
                  Open Loading Modal
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setModalVariant('disabled');
                    setModalOpen(true);
                  }}
                >
                  Open Disabled Modal
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setModalVariant('error');
                    setModalOpen(true);
                  }}
                >
                  Open Error Modal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modal Instance */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={
              modalVariant === 'loading'
                ? 'Saving Changes...'
                : modalVariant === 'error'
                ? 'Appointment Reschedule Conflict'
                : modalVariant === 'disabled'
                ? 'Locked System Record'
                : 'Confirm Appointment Cancellation'
            }
            description="Authoritative modal verification dialog with state handling."
            confirmLabel={modalVariant === 'loading' ? 'Saving...' : 'Confirm Action'}
            confirmVariant={modalVariant === 'error' ? 'destructive' : 'primary'}
            loading={modalVariant === 'loading'}
            disabled={modalVariant === 'disabled'}
            error={
              modalVariant === 'error'
                ? 'RFC 7807 Error: This time slot was claimed by another customer. Please choose a different slot.'
                : null
            }
            onConfirm={() => setModalOpen(false)}
          >
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">
                Modal content renders cleanly inside dialog box with full responsive boundaries.
              </p>
              <div className="p-3 rounded-lg bg-surface-secondary border border-border flex items-center justify-between">
                <span className="text-xs font-medium text-text-primary">Appointment #BK-8942</span>
                <StatusBadge status="Confirmed" />
              </div>
            </div>
          </Modal>
        </section>

        {/* 6. CARD & METRICCARD BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              6. Card &amp; MetricCard (`Card`, `MetricCard`)
            </h2>
            <p className="text-xs text-text-secondary">
              Surface containers and KPI cards with Normal, Loading, Disabled, and Error states.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Today's Bookings"
              value="8"
              subtext="Normal Metric State"
              icon={
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              }
            />

            <MetricCard
              title="Loading KPI"
              value="0"
              loading
            />

            <MetricCard
              title="Archived Metric"
              value="42"
              subtext="Disabled State"
              disabled
            />

            <MetricCard
              title="Failed Telemetry"
              value="--"
              error="API unreachable"
            />
          </div>
        </section>

        {/* 7. TABLE COMPONENT BENCH */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-text-primary">
              7. Table Component (`Table`)
            </h2>
            <p className="text-xs text-text-secondary">
              Data table with Normal, Loading Skeleton, Empty, and Error states.
            </p>
          </div>

          <div className="space-y-6">
            {/* Populated Table */}
            <div>
              <div className="text-xs font-semibold uppercase text-text-muted mb-2">
                Populated Normal State
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-text-primary">Sarah Connor</TableCell>
                    <TableCell>Executive Cut</TableCell>
                    <TableCell className="tabular-nums">09:00 AM</TableCell>
                    <TableCell><StatusBadge status="Confirmed" /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-text-primary">Kyle Reese</TableCell>
                    <TableCell>Beard Sculpt</TableCell>
                    <TableCell className="tabular-nums">10:30 AM</TableCell>
                    <TableCell><StatusBadge status="Pending" /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Loading Skeleton Table */}
            <div>
              <div className="text-xs font-semibold uppercase text-text-muted mb-2">
                Loading Skeleton State
              </div>
              <Table loading skeletonRows={3} skeletonCols={5} />
            </div>

            {/* Empty State Table */}
            <div>
              <div className="text-xs font-semibold uppercase text-text-muted mb-2">
                Empty State
              </div>
              <Table empty emptyMessage="No appointments scheduled for this date." />
            </div>

            {/* Error State Table */}
            <div>
              <div className="text-xs font-semibold uppercase text-text-muted mb-2">
                Error State
              </div>
              <Table error="Failed to fetch appointment data from backend. Please refresh.">
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">Data unavailable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
