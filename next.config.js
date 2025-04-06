/**
 * Next.js configuration with optimizations for Vercel deployment
 * Updated for Next.js 15.2.0 compatibility
 */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  
  // Server-side dependencies
  serverExternalPackages: ['ethers', 'pino', 'mongodb'],
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Optimize serverless functions
  serverRuntimeConfig: {
    // Override to true in production to activate optimizations
    optimizeForVercel: process.env.OPTIMIZE_FOR_VERCEL === 'true' || process.env.VERCEL === '1',
  },
  
  // Incremental static regeneration default
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
};

module.exports = nextConfig;