/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: process.env.NODE_ENV === 'development',
  }
};

module.exports = nextConfig; 