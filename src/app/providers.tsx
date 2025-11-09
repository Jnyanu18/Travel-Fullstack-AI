'use client';

import { AppProvider } from '@/contexts/AppContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
