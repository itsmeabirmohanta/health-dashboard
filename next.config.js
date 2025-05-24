/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ['@headlessui/react', 'react-chartjs-2', 'chart.js'],
  output: 'standalone',
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Enables the styled-jsx-plugin-postcss
    esmExternals: 'loose',
    // Ensure minimal size
    optimizeCss: true,
  },
  // Improve error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig; 