import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { Providers } from "./providers";
import { metadata, viewport } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export { metadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-[#F7F8FA] bg-gradient-to-br from-white to-gray-100">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col">
              <Header />
              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-1">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 