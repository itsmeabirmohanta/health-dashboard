import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Health Dashboard",
  description: "Track your health metrics and performance in real-time",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    apple: { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" }
  }
}; 