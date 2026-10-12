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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface BusinessItem {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  registeredDate: string;
  customerCount: number;
  appointmentCount: number;
  isActive: boolean;
}

export default function AdminDashboardPage() {
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const businesses: BusinessItem[] = [
    {
      id: 'biz-1',
      name: 'Apex Barber Studio',
      ownerName: 'John Doe',
      category: 'Barbershop / Grooming',
      registeredDate: '2026-08-14',
      customerCount: 142,
      appointmentCount: 520,
      isActive: true,
    },
    {
      id: 'biz-2',
      name: 'Luxe Hair Artistry',
      ownerName: 'Elena Rostova',
      category: 'Hair Salon',
      registeredDate: '2026-08-28',
      customerCount: 98,
      appointmentCount: 310,
      isActive: true,
    },
    {
      id: 'biz-3',
      name: 'Serenity Massage Therapy',
      ownerName: 'Marcus Wright',
      category: 'Wellness & Spa',
      registeredDate: '2026-09-05',
      customerCount: 64,
      appointmentCount: 180,
      isActive: true,
    },
    {
      id: 'biz-4',
      name: 'Solo Auto Spa Detail',
      ownerName: 'Travis Miller',
      category: 'Automotive Detailing',
      registeredDate: '2026-09-19',
      customerCount: 31,
      appointmentCount: 75,
      isActive: false,
    },
  ];

  const filteredBusinesses = filterActive === null
    ? businesses
    : businesses.filter((b) => b.isActive === filterActive);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Platform System Oversight
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            System-level aggregate KPIs, tenant directory, and operational monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Platform Healthy
          </span>
        </div>
      </div>

      {/* 2. Platform Aggregate KPIs Grid (§12.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Businesses"
          value="128"
          subtext="+14 onboarded this sprint"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Active Solo Tenants"
          value="119"
          subtext="93% platform active rate"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Total Customers Across Platform"
          value="4,892"
          subtext="Auto-populated CRM records"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />
        <MetricCard
          title="Platform Appointments"
          value="18,430"
          subtext="Total lifetime bookings"
          icon={
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* 3. Registered Businesses Directory (§12.2) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Registered Businesses Directory</CardTitle>
            <CardDescription>
              Platform directory of all registered solo-operator businesses.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={filterActive === null ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterActive(null)}
            >
              All (4)
            </Button>
            <Button
              variant={filterActive === true ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterActive(true)}
            >
              Active
            </Button>
            <Button
              variant={filterActive === false ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterActive(false)}
            >
              Inactive
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBusinesses.map((biz) => (
                <TableRow key={biz.id}>
                  <TableCell className="font-semibold text-text-primary">
                    {biz.name}
                  </TableCell>
                  <TableCell>{biz.ownerName}</TableCell>
                  <TableCell>{biz.category}</TableCell>
                  <TableCell className="tabular-nums text-xs">{biz.registeredDate}</TableCell>
                  <TableCell className="tabular-nums">{biz.customerCount}</TableCell>
                  <TableCell className="tabular-nums">{biz.appointmentCount}</TableCell>
                  <TableCell>
                    {biz.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Deactivated
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm">
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
