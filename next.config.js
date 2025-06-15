/**
 * Next.js configuration optimized for Web3 and ES modules
 */
const nextConfig = {
  reactStrictMode: false, // Prevents double initialization issues
  
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  
  // Move to correct location for Next.js 15
  serverExternalPackages: ['ethers', 'pino', 'mongodb'],
  
  // Webpack configuration to handle Web3 packages
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only add polyfills for client-side builds
    if (!isServer) {
      // Handle fallbacks for Node.js modules in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false, // Let browser use native crypto
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };

      // Add polyfills plugin
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    // Handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Optimize for Web3 packages
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          web3: {
            name: 'web3',
            chunks: 'all',
            test: /node_modules\/(wagmi|viem|@rainbow-me|@walletconnect|@tanstack)/,
            priority: 30,
          },
        },
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects for route normalization
  async redirects() {
    return [
      {
        source: '/audit_pro',
        destination: '/audit-pro',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Headers for API and static files
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
    ];
  },
};

module.exports = nextConfig;