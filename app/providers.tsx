"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ThemeProvider>
  );
} 