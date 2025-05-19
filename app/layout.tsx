"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <title>Health Dashboard</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex min-h-screen bg-[#F7F8FA] bg-gradient-to-br from-white to-gray-100">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col">
              <Header />
              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-1">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 