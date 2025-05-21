"use client"; // Make it a client component

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { metadata as staticMetadata, viewport as staticViewport } from "./metadata"; // Rename imported metadata
import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { usePathname } from 'next/navigation'; // Import usePathname
import { cn } from "@/lib/utils"; // Import cn for conditional class names

const inter = Inter({ subsets: ["latin"] });

// We can still export metadata and viewport if needed for static generation elsewhere,
// but they won't be used by this client component layout directly in the same way.
// For dynamic metadata in client components, you'd typically use `useEffect` and document.title, etc.
// export { staticMetadata, staticViewport }; // This might cause issues if Next.js expects metadata export from layout server component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname(); // Get current path

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const showSidebar = pathname ? !["/login", "/signup"].includes(pathname) : false; // Check if pathname is not null

  // Handle dynamic metadata if needed (example)
  useEffect(() => {
    if (typeof staticMetadata.title === 'string') {
      document.title = staticMetadata.title;
    } else if (staticMetadata.title && typeof staticMetadata.title === 'object' && 'absolute' in staticMetadata.title && typeof staticMetadata.title.absolute === 'string') {
      document.title = staticMetadata.title.absolute;
    } 
    // Add more sophisticated handling for TemplateString if needed
  }, []);

  if (!showSidebar) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#F7F8FA]`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-[#F7F8FA] bg-gradient-to-br from-white to-gray-100">
            <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
            <div 
              className={cn(
                "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "lg:pl-[4.5rem]" : "lg:pl-64"
              )}
            >
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 