import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Wildcard allowed origins to handle session ID changes in Cloud Workstations
    // @ts-ignore: allowedDevOrigins is a valid but missing type in Next.js 15
    allowedDevOrigins: ["*.cloudworkstations.dev", "*.firebase.google.com", "studio.firebase.google.com"]
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