/**
 * Next.js configuration optimized for Next.js 15.2.0
 * Stable configuration without profiling issues
 */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double-execution issues
  
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  
  // Server-side dependencies for Vercel
  serverExternalPackages: ['ethers', 'pino', 'mongodb'],
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Environment variables for build
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Static generation timeout
  staticPageGenerationTimeout: 60,
  
  // Enhanced redirects for route normalization
  async redirects() {
    return [
      // Normalize audit pro route
      {
        source: '/audit_pro',
        destination: '/audit-pro',
        permanent: true,
      },
      {
        source: '/auditpro',
        destination: '/audit-pro',
        permanent: true,
      },
      // Normalize other routes
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Cache headers for better performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/:path*.(js|css|svg|jpg|jpeg|png|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Simplified webpack configuration to prevent Fast Refresh issues
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Prevent Fast Refresh reload loops
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    
    return config;
  },
};

module.exports = nextConfig;