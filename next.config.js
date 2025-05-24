/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: true,
  },
  // Ensure trailing slashes are properly handled
  trailingSlash: false,
  // Improve cross-browser compatibility by transpiling modules
  transpilePackages: ['@headlessui/react', 'react-chartjs-2', 'chart.js'],
  // Supported browsers (modern browsers only)
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
  },
};

module.exports = nextConfig; 