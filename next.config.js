/** @type {import('next').NextConfig} */

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configure Next.js with PWA support (only in production)
let nextConfig = {
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
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
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
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
        ],
      },
    ];
  },
};

// Only add PWA in production
if (!isDevelopment) {
  try {
    const withPWA = require('@ducanh2912/next-pwa').default({
      dest: 'public',
      disable: false, // Enable in production
      register: true,
      skipWaiting: true,
      // Exclude custom service workers
      publicExcludes: ['firebase-messaging-sw.js', 'service-worker-fix.js', 'manifest.json'],
      workboxOptions: {
        disableDevLogs: true,
        // Exclude Elfsight and Instagram URLs from being handled by workbox
        navigateFallbackDenylist: [
          /^https:\/\/(api|widget-data|static)\..*\.elfsight\.com\/.*/i,
          /^https:\/\/.*\.(cdninstagram|instagram)\.com\/.*/i,
          /^https:\/\/apps\.elfsight\.com\/.*/i,
          /^https:\/\/service\.elfsight\.com\/.*/i,
          /^https:\/\/.*\.elfsightcdn\.com\/.*/i
        ],
        // Custom runtime caching rules for Elfsight
        runtimeCaching: [
          {
            // Cache Elfsight API requests with NetworkOnly strategy
            urlPattern: /^https:\/\/(api|widget-data|static)\..*\.elfsight\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Cache Instagram API requests with NetworkOnly strategy
            urlPattern: /^https:\/\/.*\.(cdninstagram|instagram)\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Cache Elfsight CDN requests with NetworkOnly strategy
            urlPattern: /^https:\/\/.*\.elfsightcdn\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Cache Elfsight apps requests with NetworkOnly strategy
            urlPattern: /^https:\/\/apps\.elfsight\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Cache Elfsight service requests with NetworkOnly strategy
            urlPattern: /^https:\/\/service\.elfsight\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Cache page requests with NetworkFirst strategy
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'side-hustle-pages',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          },
          {
            // Cache image requests with CacheFirst strategy
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'side-hustle-images',
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
              }
            }
          },
          {
            // Cache font requests with CacheFirst strategy
            urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'side-hustle-fonts',
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            // Cache style requests with StaleWhileRevalidate strategy
            urlPattern: /\.(?:css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'side-hustle-styles',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          },
          {
            // Cache script requests with StaleWhileRevalidate strategy
            urlPattern: /\.(?:js)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'side-hustle-scripts',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          }
        ]
      },
      ...nextConfig
    });
    
    nextConfig = withPWA(nextConfig);
    console.log('PWA support enabled for production build');
  } catch (e) {
    console.error('Error setting up PWA:', e);
  }
} else {
  console.log('PWA support disabled in development mode');
}

module.exports = nextConfig;
