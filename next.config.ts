import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
  reactStrictMode: true,
  experimental: {
    // @ts-expect-error: This is a valid option but types might be outdated
    allowedDevOrigins: [
      "3000-firebase-studio-1770307012357.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev",
      "localhost:3000"
    ],
  },
};

export default nextConfig;
