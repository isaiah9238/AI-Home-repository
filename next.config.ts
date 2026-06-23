import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Cache invalidation pulse: 2026-04-27T05:12:31Z
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:9002',
        '3000-firebase-studio-1770307012357.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
        '*.cloudworkstations.dev',
        '*.web.app',
        '*.firebaseapp.com',
        '*.google.com',
        '*.googleusercontent.com',
        '*.firebase-studio.google',
        '*.studio.firebase.google.com'
      ],
    },
  },
  reactStrictMode: true,
  // 🛠️ Webpack custom file watching configuration for Cloud Workstations
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for file modifications every 1 second
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;