import type { NextConfig } from 'next';

/**
 * Next.js configuration with optimizations for Vercel deployment
 * Includes specific settings to improve performance of serverless functions
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Optimize for production
  swcMinify: true,
  // Increase serverless function memory for better performance
  experimental: {
    serverComponentsExternalPackages: ['ethers', 'pino', 'mongodb'],
  },
  // Configure API response size limit
  api: {
    responseLimit: '16mb',
    bodyParser: {
      sizeLimit: '2mb',
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

export default nextConfig;