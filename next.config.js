/** @type {import('next').NextConfig} */

// Simple Next.js configuration without PWA for development
const nextConfig = {
  // Keep original configuration
  reactStrictMode: false, // Changed to false to prevent double rendering issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization settings - critical for Instagram and Google integrations
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.elfsight.com',
      },
      {
        protocol: 'https',
        hostname: '*.elfsightcdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.instagram.com',
      },
    ],
  },
  
  // Add trailing slash for better static site compatibility
  trailingSlash: true,
  
  // Increase timeouts to prevent internal server errors
  serverRuntimeConfig: {
    // Will only be available on the server side
    timeoutMs: 60000, // 60 seconds
  },
  
  // Experimental features - fixed to use only supported options
  experimental: {
    // Only include supported experimental features
    optimizeCss: true,
    scrollRestoration: true,
    serverMinification: true,
    serverSourceMaps: false,
  },
  
  // Webpack configuration for better performance and polyfills
  webpack: (config, { isServer, dev }) => {
    // Client-side specific configurations
    if (!isServer) {
      // Add fallbacks for browser modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@emotion/is-prop-valid': require.resolve('@emotion/is-prop-valid'),
      };
      
      // Add our custom polyfills
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        // Add our polyfills to the main entry
        if (entries['main.js']) {
          entries['main.js'] = ['./src/polyfills/index.js', ...entries['main.js']];
        }
        
        return entries;
      };
    }
    
    return config;
  },
  
  // Fix for client-side navigation "Failed to fetch" errors
  onDemandEntries: {
    // Keep pages in memory for longer to prevent "Failed to fetch" errors
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
  
  // Add headers to fix CORS issues with Elfsight
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        // Specific headers for Elfsight API requests
        source: '/api/elfsight/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
    ];
  },
};

// For production, we'll add the PWA configuration
if (process.env.NODE_ENV === 'production') {
  // This code will only run during the build process, not during development
  try {
    const withPWA = require('@ducanh2912/next-pwa').default;
    module.exports = withPWA({
      dest: 'public',
      disable: false,
      register: true,
      skipWaiting: true,
      // Exclude custom service workers
      publicExcludes: ['firebase-messaging-sw.js', 'service-worker-fix.js', 'manifest.json'],
      workboxOptions: {
        disableDevLogs: true,
        // Custom runtime caching rules for Elfsight
        runtimeCaching: [
          {
            // Cache Elfsight API requests with NetworkFirst strategy
            urlPattern: /^https:\/\/(api|widget-data)\..*\.elfsight\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              // Timeout for Elfsight API requests
              networkTimeoutSeconds: 10,
              cacheName: 'elfsight-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              // Add CORS headers to cached responses
              cacheableResponse: {
                statuses: [0, 200],
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
              }
            }
          },
          {
            // Cache Instagram API requests with NetworkFirst strategy
            urlPattern: /^https:\/\/.*\.(cdninstagram|instagram)\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              // Timeout for Instagram API requests
              networkTimeoutSeconds: 10,
              cacheName: 'instagram-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              // Add CORS headers to cached responses
              cacheableResponse: {
                statuses: [0, 200],
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
              }
            }
          }
        ],
        exclude: [
          '_redirects',
          '**/_redirects',
          '/out/_redirects',
          /\/_redirects$/,
          /\.map$/,
          /^manifest.*\.js$/,
          /firebase-messaging-sw\.js$/,
          /service-worker-fix\.js$/,
          /\.DS_Store/,
          /\.git/,
          // Also exclude Elfsight and Instagram URLs
          /elfsight\.com/,
          /elfsightcdn\.com/,
          /cdninstagram\.com/,
          /instagram\.com/,
        ],
      },
    })(nextConfig);
  } catch (e) {
    console.warn('PWA plugin not available, using fallback config');
    module.exports = nextConfig;
  }
} else {
  // For development, just use the basic config
  module.exports = nextConfig;
}
