'use client';

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-lg shadow-xl text-center space-y-6 safe-top safe-bottom safe-left safe-right">
        <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          You're offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300">
          {isOnline 
            ? "Great! You're back online. Reconnecting..." 
            : "It seems you're not connected to the internet right now."}
        </p>
        
        <div className="pt-4">
          <Button 
            variant="default"
            className="w-full" 
            onClick={() => window.location.reload()}
          >
            {isOnline ? "Reload App" : "Try Again"}
          </Button>
          
          {!isOnline && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              You can still use some features of FitPulse while offline.
            </p>
          )}
        </div>
        
        {isOnline && (
          <div className="pt-2">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 