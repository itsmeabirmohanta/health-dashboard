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
  const pathname = usePathname(); // Get current path
  const [isAppLoading, setIsAppLoading] = useState(true); // Add app loading state
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // On mobile, sidebar should start collapsed
    if (isMobileView) {
      setSidebarCollapsed(true);
    }
  }, [isMobileView]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleAddDevice = () => {
    setShowAddDeviceModal(true);
    // Signal to children components that we need to show the device modal
    const event = new CustomEvent('showAddDeviceModal');
    document.dispatchEvent(event);
  };

  const showSidebar = pathname ? !["/login", "/signup"].includes(pathname) : false; // Check if pathname is not null

  // Effect to hide PageLoader after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 750); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  // Handle dynamic metadata if needed
  useEffect(() => {
    if (typeof metadata.title === 'string') {
      document.title = metadata.title;
    }
  }, []);

  // Mark page as ready for animations
  useEffect(() => {
    setIsPageReady(true);
  }, []);

  if (isAppLoading) {
    return <PageLoader />;
  }

  if (!showSidebar) {
    return (
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        </head>
        <body className={`${inter.className} bg-[#F7F8FA] safe-padding-top safe-padding-bottom`}>
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} safe-padding-top safe-padding-bottom`}>
        <Providers>
          <div className={cn(
            "flex min-h-screen bg-[#F7F8FA] bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800",
            "no-fouc",
            isPageReady && "ready"
          )}>
            <Sidebar 
              collapsed={sidebarCollapsed} 
              toggleSidebar={toggleSidebar} 
              onAddDevice={handleAddDevice}
            />
            <div 
              className={cn(
                "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "lg:pl-[4.5rem]" : "lg:pl-64",
                // Remove top padding since we don't need a header anymore
                "pt-0"
              )}
            >
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="page-transition">
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