import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
};

export default nextConfig;