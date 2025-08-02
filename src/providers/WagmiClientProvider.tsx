// src/providers/WagmiClientProvider.tsx
'use client'; // This directive marks this component as a Client Component

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi'; // Import our wagmi config

// Create a new QueryClient instance for react-query
const queryClient = new QueryClient();

/**
 * WagmiClientProvider wraps the application with WagmiProvider and QueryClientProvider.
 * This component is explicitly marked as a 'use client' component to ensure
 * wagmi's client-side hooks and context are correctly initialized.
 */
export function WagmiClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
