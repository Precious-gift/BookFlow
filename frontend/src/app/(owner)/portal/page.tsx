'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  MetricCard,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, AppointmentStatus } from '@/components/ui/status-badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';

interface AppointmentRecord {
  id: string;
  refCode: string;
  customerName: string;
  phone: string;
  service: string;
  time: string;
  status: AppointmentStatus;
}

export default function OwnerPortalOverviewPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<AppointmentRecord | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const appointments: AppointmentRecord[] = [
    {
      id: 'apt-1',
      refCode: '#BK-8942',
      customerName: 'Marcus Vance',
      phone: '(555) 234-8901',
      service: 'Executive Precision Cut',
      time: '09:00 AM Today',
      status: 'Pending',
    },
    {
      id: 'apt-2',
      refCode: '#BK-8943',
      customerName: 'Sarah Jenkins',
      phone: '(555) 872-1144',
      service: 'Express Beard Sculpt',
      time: '10:30 AM Today',
      status: 'Confirmed',
    },
    {
      id: 'apt-3',
      refCode: '#BK-8940',
      customerName: 'David Kim',
      phone: '(555) 431-7722',
      service: 'Executive Precision Cut',
      time: 'Yesterday 04:00 PM',
      status: 'Completed',
    },
    {
      id: 'apt-4',
      refCode: '#BK-8938',
      customerName: 'Liam O\'Connor',
      phone: '(555) 902-3311',
      service: 'Hot Towel Deluxe',
      time: 'Yesterday 02:15 PM',
      status: 'Cancelled',
    },
  ];

  const handleInspect = (apt: AppointmentRecord) => {
    setActiveAppointment(apt);
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setModalOpen(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. Portal View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Owner Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time agenda, solo-operator KPIs, and appointment lifecycle actions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 sm:flex-initial"
            onClick={() => handleInspect(appointments[0])}
          >
            Review Pending (1)
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1 sm:flex-initial"
            onClick={() => handleInspect(appointments[1])}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* 2. Executive KPI Metric Cards Grid (§9.3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Appointments"
          value="6"
          subtext="2 pending confirmation"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Upcoming This Week"
          value="24"
          subtext="Across active business days"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Active Customers (CRM)"
          value="142"
          subtext="Auto-populated directory"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />
        <MetricCard
          title="Completed This Month"
          value="89"
          subtext="Concluded appointments"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* 3. Today's Agenda & Appointments Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Appointments & Agenda</CardTitle>
            <CardDescription>
              Showing current appointments across all lifecycle states.
            </CardDescription>
          </div>
          <span className="text-xs text-text-muted hidden sm:inline">
            Touch targets &gt;= 44px
          </span>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref Code</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-semibold text-text-primary text-xs">
                    {apt.refCode}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-text-primary">{apt.customerName}</div>
                    <div className="text-xs text-text-muted">{apt.phone}</div>
                  </TableCell>
                  <TableCell>{apt.service}</TableCell>
                  <TableCell className="tabular-nums">{apt.time}</TableCell>
                  <TableCell>
                    <StatusBadge status={apt.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleInspect(apt)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 4. Interactive Action Modal Dialog */}
      {activeAppointment && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Manage Appointment ${activeAppointment.refCode}`}
          description="Review details and perform single-operator status transitions."
          confirmLabel={activeAppointment.status === 'Pending' ? 'Confirm Appointment' : 'Save Changes'}
          cancelLabel="Close"
          onConfirm={handleConfirmAction}
          loading={modalLoading}
        >
          <div className="space-y-3 text-left">
            <div className="p-3 rounded-lg bg-surface-secondary border border-border flex justify-between items-center">
              <div>
                <div className="text-xs text-text-muted uppercase">Client Name</div>
                <div className="font-semibold text-sm text-text-primary">
                  {activeAppointment.customerName}
                </div>
              </div>
              <StatusBadge status={activeAppointment.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-text-muted block">Phone</span>
                <span className="font-medium text-text-primary">{activeAppointment.phone}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <span className="text-text-muted block">Scheduled Time</span>
                <span className="font-medium text-text-primary">{activeAppointment.time}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-surface text-xs">
              <span className="text-text-muted block">Service Rendered</span>
              <span className="font-medium text-text-primary">{activeAppointment.service}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
