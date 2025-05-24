"use client";

import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      themes={['light', 'dark']}
      disableTransitionOnChange
    >
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ThemeProvider>
  );
} 