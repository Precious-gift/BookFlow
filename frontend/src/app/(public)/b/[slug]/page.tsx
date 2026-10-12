import React, { Suspense } from 'react';
import BookingFlowClient from './booking-flow-client';

export function generateStaticParams() {
  return [{ slug: 'apex-barber' }];
}

export default async function PublicBookingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted">
          Loading booking flow...
        </div>
      }
    >
      <BookingFlowClient slug={slug} />
    </Suspense>
  );
}
