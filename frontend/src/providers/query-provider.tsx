'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';

/**
 * Creates a configured QueryClient instance.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a QueryClient instance:
 * - On the server: always creates a new instance to avoid cross-request data leaks.
 * - On the browser: reuses a singleton instance so React does not discard cache
 *   if it suspends during initial render.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

/**
 * Global TanStack Query Client Provider for BookFlow.
 * Enforces proper client boundary and safe lifecycle across Suspense renders.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
}

export default QueryProvider;
