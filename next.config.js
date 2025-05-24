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
};

module.exports = nextConfig; 