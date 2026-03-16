import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Replace the * with your specific ID from the terminal warning 
    // or use a wildcard to cover the whole workspace domain
    // @ts-ignore: allowedDevOrigins is a valid but missing type in Next.js 15
    allowedDevOrigins: ["3000-firebase-studio-1770307012357.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev", "studio.firebase.google.com/studio-3863072923"]
  },
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
}

export default nextConfig;
