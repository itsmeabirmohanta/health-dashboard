/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ['@headlessui/react', 'react-chartjs-2', 'chart.js'],
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
};

module.exports = nextConfig; 