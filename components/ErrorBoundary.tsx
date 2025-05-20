"use client";

import { useEffect, useState } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ErrorBoundary({ 
  children, 
  fallback = <DefaultErrorUI /> 
}: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by error boundary:", error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

function DefaultErrorUI() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="glass rounded-2xl p-8 max-w-md w-full">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while processing your request. Please try refreshing the page.
        </p>
        <button
          onClick={refreshPage}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-md transition-all"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
} 