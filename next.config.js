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
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/magnificent-churros-3c51ed\.netlify\.app\/.*$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'app-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 86400
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
            maxAgeSeconds: 604800
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
    ignoreBuildErrors: true,
  },
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
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@emotion/is-prop-valid': require.resolve('@emotion/is-prop-valid'),
      };
    }
    return config;
  },
  /* experimental: {
    prefetchInRender: true, // Removed due to incompatibility
  }, */
};

module.exports = process.env.NODE_ENV === 'production' ? withPWA(nextConfig) : nextConfig;
