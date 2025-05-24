"use client"; // Make it a client component

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { usePathname } from 'next/navigation'; // Import usePathname
import { cn } from "@/lib/utils"; // Import cn for conditional class names
import PageLoader from "@/components/ui/PageLoader"; // Import PageLoader
import { metadata } from "./metadata"; // Import metadata for client-side usage
import { Menu, X } from "lucide-react";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Optimize font display
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname(); // Get current path
  const [isAppLoading, setIsAppLoading] = useState(true); // Add app loading state
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Error boundary fallback
  if (error) {
    return (
      <html lang="en" className={inter.variable}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=yes" />
        </head>
        <body className={cn(inter.className, "bg-white dark:bg-gray-900")}>
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {error.message || "The application encountered an unexpected error."}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
              >
                Refresh the page
              </button>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Handle client-side mounting
  useEffect(() => {
    try {
      setIsMounted(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  }, []);

  // Handle responsive sidebar state
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const handleResize = () => {
        const mobile = window.innerWidth < 1024;
        setIsMobileView(mobile);
        if (mobile) {
          setSidebarCollapsed(true);
        }
      };
  
      // Set initial state
      handleResize();
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error handling resize'));
    }
  }, [isMounted]);

  // Effect to handle orientation changes on mobile
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const handleOrientationChange = () => {
        // Force reflow on orientation change for better mobile handling
        document.body.style.display = 'none';
        // Trigger reflow
        void document.body.offsetHeight;
        document.body.style.display = '';
      };
      
      window.addEventListener('orientationchange', handleOrientationChange);
      return () => window.removeEventListener('orientationchange', handleOrientationChange);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error handling orientation change'));
    }
  }, [isMounted]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleAddDevice = () => {
    setShowAddDeviceModal(true);
    // Signal to children components that we need to show the device modal
    const event = new CustomEvent('showAddDeviceModal');
    document.dispatchEvent(event);
  };

  const showSidebar = pathname ? !["/login", "/signup"].includes(pathname) : false;

  // Effect to hide PageLoader after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 750);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle dynamic metadata if needed
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      if (typeof metadata.title === 'string') {
        document.title = metadata.title;
      }
    } catch (err) {
      console.error('Error setting metadata:', err);
    }
  }, [isMounted]);

  // Mark page as ready for animations
  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMounted]);

  // Handle service worker registration for PWA
  useEffect(() => {
    try {
      if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
              console.log('Service Worker registration successful with scope: ', registration.scope);
            }
          ).catch(function(err) {
            console.error('Service Worker registration failed: ', err);
          });
        });
      }
    } catch (err) {
      console.error('Error registering service worker:', err);
    }
  }, []);

  // Reset sidebar on page change for mobile
  useEffect(() => {
    if (isMobileView) {
      setSidebarCollapsed(true);
    }
  }, [pathname, isMobileView]);

  if (isAppLoading) {
    return <PageLoader />;
  }

  if (!showSidebar) {
    return (
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content="#ef4444" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body className={cn(
          inter.className, 
          "bg-[#F7F8FA]",
          "pt-[env(safe-area-inset-top)]", 
          "pb-[env(safe-area-inset-bottom)]",
          "pl-[env(safe-area-inset-left)]", 
          "pr-[env(safe-area-inset-right)]"
        )}>
          <Providers>
            <div className={cn(
              "page-transition no-fouc",
              isPageReady && "ready"
            )}>
              {children}
            </div>
          </Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ef4444" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Add noscript tag to redirect to fallback page if JavaScript is disabled */}
        <noscript>
          <meta httpEquiv="refresh" content="0;url=/fallback.html" />
        </noscript>
      </head>
      <body className={cn(
        inter.className,
        "pt-[env(safe-area-inset-top)]", 
        "pb-[env(safe-area-inset-bottom)]",
        "pl-[env(safe-area-inset-left)]", 
        "pr-[env(safe-area-inset-right)]"
      )}>
        <Providers>
          <div className={cn(
            "flex min-h-screen bg-[#F7F8FA] bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800",
            "no-fouc",
            isPageReady && "ready"
          )}>
            {/* Mobile Menu Button - Only visible on small screens */}
            {isMobileView && sidebarCollapsed && (
              <button 
                onClick={toggleSidebar} 
                className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md touch-target"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
            
            <Sidebar 
              collapsed={sidebarCollapsed} 
              toggleSidebar={toggleSidebar} 
              onAddDevice={handleAddDevice}
              isMobile={isMobileView}
            />
            <div 
              className={cn(
                "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                sidebarCollapsed || isMobileView ? "lg:pl-[4.5rem]" : "lg:pl-64",
                "pt-0 w-full"
              )}
            >
              <main className="flex-1 p-4 md:p-6 lg:p-8 w-full overflow-x-hidden">
                <div className="page-transition w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 