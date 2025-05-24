import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'FitPulse Health Dashboard',
  description: 'Track and monitor your health metrics in real-time',
  applicationName: 'FitPulse',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'FitPulse',
    statusBarStyle: 'black-translucent',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#ef4444',
    'msapplication-tap-highlight': 'no',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
}; 