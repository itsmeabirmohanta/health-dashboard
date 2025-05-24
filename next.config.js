/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ['@headlessui/react', 'react-chartjs-2', 'chart.js'],
  output: 'export',
  distDir: 'out',
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
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
  // Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Only run these optimizations for production client-side builds
    if (!dev && !isServer) {
      // Enable production mode
      config.mode = 'production';
      
      // Optimize chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '.',
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
      
      // Set minimize to true
      config.optimization.minimize = true;

      // Reduce bundle size by pruning unused modules
      config.optimization.usedExports = true;
    }
    
    // Enable native modules in worker for service worker usage
    config.resolve.fallback = {
      ...config.resolve.fallback, 
      fs: false,
      module: false,
      path: false,
      os: false,
    };
    
    // Fix issues with process.env
    config.plugins.forEach((plugin) => {
      if (plugin.constructor.name === 'DefinePlugin') {
        plugin.definitions = {
          ...plugin.definitions,
          'process.env': {
            ...plugin.definitions['process.env'],
            NODE_ENV: JSON.stringify(dev ? 'development' : 'production'),
          }
        };
      }
    });
    
    return config;
  },
};

module.exports = nextConfig; 