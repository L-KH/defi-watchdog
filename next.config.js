/**
 * Next.js configuration optimized for Vercel deployment
 * Updated for Next.js 15.2.0 compatibility
 */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for Vercel
  swcMinify: true,
  
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
  
  // Optimize serverless functions for Vercel
  serverRuntimeConfig: {
    optimizeForVercel: true,
  },
  
  // Static generation timeout
  staticPageGenerationTimeout: 60,
  
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
  
  // Webpack configuration for better build performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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