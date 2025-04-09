/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
    // Exclude problematic files from precaching
    exclude: [
      '_redirects',
      '**/_redirects',
      '/out/_redirects',
      /\/_redirects$/,
      /\.map$/,
      /^manifest.*\.js$/,
      /\.DS_Store/,
      /\.git/
    ],
    // Define custom runtime caching rules similar to your previous project
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/magnificent-churros-3c51ed\.netlify\.app\/.*$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'app-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 86400 // 1 day
          }
        }
      },
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 604800 // 1 week
          }
        }
      }
    ]
  },
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
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
  // Ensure trailing slashes are added
  trailingSlash: true,
  // Add webpack configuration if needed
  webpack(config, { isServer, webpack }) {
    // Inject Firebase config into service worker
    if (!isServer) {
      // Create a stringified version of the Firebase config for injection
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      // Add a plugin to inject the Firebase config into the service worker
      config.plugins.push(
        new webpack.DefinePlugin({
          'self.__FIREBASE_CONFIG__': JSON.stringify(firebaseConfig),
        })
      );
    }
    
    return config;
  },
  // Use static export for Netlify
  output: 'export',
};

module.exports = withPWA(nextConfig);
