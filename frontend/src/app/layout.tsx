import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BookFlow — Solo-Operator Booking & CRM',
  description:
    'BookFlow is an appointment booking and lightweight CRM platform designed specifically for independent, single-operator service businesses.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-background text-text-primary antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
