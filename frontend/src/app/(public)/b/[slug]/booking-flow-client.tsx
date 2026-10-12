'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { TimeChip } from '@/components/ui/time-chip';
import { StatusBadge } from '@/components/ui/status-badge';

export default function BookingFlowClient({ slug }: { slug: string }) {
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00');
  const [selectedService, setSelectedService] = useState<string>('srv-1');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const availableSlots = [
    { time: '09:00', period: 'AM' },
    { time: '09:45', period: 'AM' },
    { time: '10:30', period: 'AM' },
    { time: '11:15', period: 'AM' },
    { time: '01:00', period: 'PM' },
    { time: '01:45', period: 'PM' },
    { time: '02:30', period: 'PM' },
    { time: '03:15', period: 'PM' },
  ];

  return (
    <div className="space-y-6">
      {/* Business Header Card */}
      <Card className="border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-sm select-none">
              {slug.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary capitalize tracking-tight">
                  {slug.replace(/-/g, ' ')}
                </h1>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                  Verified Solo Operator
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Direct Booking Portal • bookflow.me/b/{slug}
              </p>
            </div>
          </div>
          <StatusBadge status="Pending" label="Direct Guest Flow" size="md" />
        </div>
      </Card>

      {/* Accountless Booking Stepper Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Select Service */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Step 1
                </span>
                <CardTitle className="text-base mt-1">Select Service</CardTitle>
                <CardDescription>Choose from available services</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                onClick={() => setSelectedService('srv-1')}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none min-h-[44px] ${
                  selectedService === 'srv-1'
                    ? 'border-primary bg-primary-subtle text-primary font-medium'
                    : 'border-border bg-surface hover:border-border-hover'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-text-primary">Executive Precision Cut</span>
                  <span className="font-bold text-text-primary">$45</span>
                </div>
                <div className="text-xs text-text-secondary mt-1">45 mins • Hair & Beard styling</div>
              </div>

              <div
                onClick={() => setSelectedService('srv-2')}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none min-h-[44px] ${
                  selectedService === 'srv-2'
                    ? 'border-primary bg-primary-subtle text-primary font-medium'
                    : 'border-border bg-surface hover:border-border-hover'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-text-primary">Express Beard Sculpt</span>
                  <span className="font-bold text-text-primary">$25</span>
                </div>
                <div className="text-xs text-text-secondary mt-1">30 mins • Hot towel & razor outline</div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Step 2: Select Date & Available Time Slot */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Step 2
                </span>
                <CardTitle className="text-base mt-1">Select Time Slot</CardTitle>
                <CardDescription>Touch targets &gt;= 44px</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-medium text-text-secondary mb-2">
                Available Today (Oct 12)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => (
                  <TimeChip
                    key={slot.time}
                    time={slot.time}
                    period={slot.period}
                    selected={selectedSlot === slot.time}
                    onClick={() => setSelectedSlot(slot.time)}
                    className="w-full"
                  />
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Step 3: Strictly 3 Guest Details Fields (§11) */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Step 3
                </span>
                <CardTitle className="text-base mt-1">Guest Details</CardTitle>
                <CardDescription>Strictly 3 fields • Zero signup</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InputField
                label="Full Name"
                required
                placeholder="e.g. Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={formSubmitted && !fullName ? 'Full Name is required.' : undefined}
              />
              <InputField
                label="Phone Number"
                type="tel"
                required
                placeholder="e.g. (555) 234-5678"
                helperText="Required customer contact information."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={formSubmitted && !phone ? 'Phone Number is required.' : undefined}
              />
              <InputField
                label="Email"
                type="email"
                optional
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CardContent>
          </div>

          <CardFooter>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setFormSubmitted(true)}
            >
              Confirm Appointment Request
            </Button>
          </CardFooter>
        </Card>
      </div>

      {formSubmitted && fullName && phone && (
        <Card className="border-status-confirmed-border bg-status-confirmed-bg/20">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-status-confirmed text-white flex items-center justify-center shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-text-primary">
                  Booking Request Staged: #BK-8942
                </h3>
                <StatusBadge status="Pending" />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Your appointment for {selectedSlot} has been recorded for {fullName}. Awaiting confirmation from {slug.replace(/-/g, ' ')}.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
